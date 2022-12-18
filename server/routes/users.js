import express from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const router = express.Router();
import { User } from "../models/User.js";
import { Recipe } from "../models/Recipe.js";
import { Token } from "../models/Token.js";
import {
  isAdminUser,
  isModeratorUser,
  isAllowedToEditUser,
  isEmailTaken,
  isUsernameTaken,
} from "../utils-module/authentication.js";
import { isValidObjectId } from "../utils-module/misc.js";
import {
  emailUserPasswordReset,
  emailUserUsername,
} from "../utils-module/notifications.js";

// Routes

//GET ALL USERS
router.get("/", async (req, res, next) => {
  try {
    let isModerator = await isModeratorUser(req.headers.validatedToken);
    if (isModerator) {
      //get users
      let users = await User.find({}).select({
        role: 1,
        username: 1,
        firstname: 1,
        lastname: 1,
        email: 1,
        registration_date: 1,
        last_sign_in: 1,
      });

      //get counts for each recipe privacy state per user
      const public_recipes_count = await Recipe.aggregate([
        {
          $match: {
            private: false,
            approval_required: false,
            approved: false,
          },
        },
        {
          $group: {
            _id: "$owner",
            public_recipes_count: { $sum: 1 },
          },
        },
      ]);

      const private_recipes_count = await Recipe.aggregate([
        {
          $match: {
            private: true,
          },
        },
        {
          $group: {
            _id: "$owner",
            private_recipes_count: { $sum: 1 },
          },
        },
      ]);

      const approval_required_recipes_count = await Recipe.aggregate([
        {
          $match: {
            private: false,
            approval_required: true,
            approved: false,
          },
        },
        {
          $group: {
            _id: "$owner",
            approval_required_recipes_count: { $sum: 1 },
          },
        },
      ]);

      const approved_recipes_count = await Recipe.aggregate([
        {
          $match: {
            private: false,
            approval_required: false,
            approved: true,
          },
        },
        {
          $group: {
            _id: "$owner",
            approved_recipes_count: { $sum: 1 },
          },
        },
      ]);

      const total_recipes_count = await Recipe.aggregate([
        {
          $group: {
            _id: "$owner",
            total_recipes_count: { $sum: 1 },
          },
        },
      ]);

      //combining all of the recipe counts per user id
      let recipe_counts = {};
      [
        ...public_recipes_count,
        ...private_recipes_count,
        ...approval_required_recipes_count,
        ...approved_recipes_count,
        ...total_recipes_count,
      ].forEach((privacy) => {
        const { _id, ...counts } = privacy;

        if (recipe_counts[_id]) {
          recipe_counts[_id] = {
            ...recipe_counts[_id],
            ...counts,
          };
        } else {
          recipe_counts[_id] = counts;
        }
      });

      const counts_base = {
        private_recipes_count: 0,
        public_recipes_count: 0,
        approval_required_recipes_count: 0,
        approved_recipes_count: 0,
        total_recipes_count: 0,
      };
      // combine users and recipe counts
      users.forEach((user_record, index, users) => {
        users[index] = {
          ...user_record.toObject(),
          ...counts_base,
          ...recipe_counts[user_record._id],
        };
      });

      req.logger.info("Sending users data with recipe counts", {
        initiator_id: req.headers.validatedToken._id,
      });
      res.status(200).send(users);
    } else {
      req.logger.info("Failed to retrieve users data, missing privileges", {
        initiator_id: req.headers.validatedToken._id,
      });
      res.status(403).send("Missing privileges");
    }
  } catch (err) {
    next(err);
  }
});

//CHECK IF A USER EXISTS
router.get("/user/exists/:user_id", async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.user_id)) {
      req.logger.info("Failed user lookup, user id is invalid", {
        user_id: req.params.user_id,
      });
      res.status(200).send(false);
      return;
    }

    let userExists = await User.exists({ _id: req.params.user_id });

    if (userExists) {
      req.logger.info("Successfull user lookup, user exists in the DB", {
        user_id: req.params.user_id,
      });
      res.status(200).send(true);
    } else {
      req.logger.info("Failed user lookup, user does not exist in the DB", {
        user_id: req.params.user_id,
      });
      res.status(200).send(false);
    }
  } catch (err) {
    next(err);
  }
});

//GET A SPECIFIC USER PROFILE DATA
router.get("/user/info/:user_id", async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.user_id)) {
      req.logger.info(
        "Failed to retrieve user profile data, user id is invalid",
        {
          user_id: req.params.user_id,
        }
      );
      res.status(404).send("User not found");
      return;
    }

    let userInfo = await User.findById(req.params.user_id).select(
      "firstname lastname registration_date role"
    );

    if (userInfo) {
      let approvedRecipesCount = await Recipe.find({
        owner: req.params.user_id,
        approved: true,
      }).distinct("_id");

      let publicRecipesCount = await Recipe.find({
        owner: req.params.user_id,
        private: false,
      }).distinct("_id");

      let favoriteRecipesCount = await Recipe.find({
        favorited_by: req.params.user_id,
        private: false,
      }).distinct("_id");

      req.logger.info("Sending user profile data", {
        user_id: req.params.user_id,
      });
      res.status(200).json({
        userInfo,
        metrics: {
          approvedRecipesCount: approvedRecipesCount.length,
          publicRecipesCount: publicRecipesCount.length,
          favoriteRecipesCount: favoriteRecipesCount.length,
        },
      });
    } else {
      req.logger.info(
        "Failed to retrieve user profile data, user does not exist in the DB",
        {
          user_id: req.params.user_id,
        }
      );
      res.status(404).send("User not found");
    }
  } catch (err) {
    next(err);
  }
});

//GET A SPECIFIC USER ACCOUNT DATA
router.get("/user/account/info/:user_id", async (req, res, next) => {
  try {
    let isModerator = await isModeratorUser(req.headers.validatedToken);
    if (
      !isModerator &&
      !(req.headers.validatedToken._id === req.params.user_id)
    ) {
      req.logger.info(
        "Failed to retrieve user account data, missing privileges",
        {
          user_id: req.params.user_id,
          initiator_id: req.headers.validatedToken._id,
        }
      );
      res.status(403).send("Missing privileges");
      return;
    }

    if (!isValidObjectId(req.params.user_id)) {
      req.logger.info(
        "Failed to retrieve user account data, user id is invalid",
        {
          user_id: req.params.user_id,
          initiator_id: req.headers.validatedToken._id,
        }
      );
      res.status(404).send("User not found");
      return;
    }

    let userInfo = await User.findById(req.params.user_id).select(
      "username firstname lastname email role notification_opt_in"
    );

    if (userInfo) {
      req.logger.info("Sending user account data", {
        user_id: req.params.user_id,
        initiator_id: req.headers.validatedToken._id,
      });
      res.status(200).json(userInfo);
    } else {
      req.logger.info(
        "Failed to retrieve user account data, user does not exist in the DB",
        {
          user_id: req.params.user_id,
          initiator_id: req.headers.validatedToken._id,
        }
      );
      res.status(404).send("User not found");
    }
  } catch (err) {
    next(err);
  }
});

//DELETE A USER
router.post("/user/delete", async (req, res, next) => {
  try {
    if (!isValidObjectId(req.body._id)) {
      req.logger.info("Failed to delete user, user id is invalid", {
        user_id: req.body._id,
        initiator_id: req.headers.validatedToken._id,
      });
      res.status(404).send("User not found");
      return;
    }
    let user = await User.findById(req.body._id);
    if (user) {
      let allowedToEdit = await isAllowedToEditUser(
        req.headers.validatedToken,
        user
      );
      if (allowedToEdit) {
        await Recipe.deleteMany({ owner: user._id });
        let deletedUser = await User.findOneAndDelete({ _id: user._id });

        req.logger.info("Successfully deleted user", {
          user_id: req.body._id,
          initiator_id: req.headers.validatedToken._id,
        });
        res.status(200).json(deletedUser);
      } else {
        req.logger.info("Failed to delete user, missing privileges", {
          user_id: req.body._id,
          initiator_id: req.headers.validatedToken._id,
        });
        res.status(403).send("Missing privileges");
      }
    } else {
      req.logger.info("Failed to delete user, user does not exist in the DB", {
        user_id: req.body._id,
        initiator_id: req.headers.validatedToken._id,
      });
      res.status(404).send("User not found");
    }
  } catch (err) {
    next(err);
  }
});

//EDIT USER DETAILS
router.post("/user/edit", async (req, res, next) => {
  try {
    if (!isValidObjectId(req.body.userData._id)) {
      req.logger.info("Failed to edit user, user id is invalid", {
        user_id: req.body.userData._id,
        initiator_id: req.headers.validatedToken._id,
      });
      res.status(404).send("User not found");
      return;
    }
    let userToEdit = await User.findById(req.body.userData._id);

    if (userToEdit) {
      let allowedToEdit = await isAllowedToEditUser(
        req.headers.validatedToken,
        userToEdit
      );

      if (allowedToEdit || userToEdit._id == req.headers.validatedToken._id) {
        let isAdmin = await isAdminUser(req.headers.validatedToken);
        if (!isAdmin) {
          delete req.body.userData.role;
        }

        if (userToEdit.username !== req.body.userData.username) {
          let usernameTaken = await isUsernameTaken(req.body.userData.username);
          if (usernameTaken) {
            req.logger.info(
              "Failed to edit user, username already exists in the DB",
              {
                user_id: req.body.userData._id,
                initiator_id: req.headers.validatedToken._id,
              }
            );
            res.status(409).send("Username already exists.");
            return;
          }
        }
        if (userToEdit.email !== req.body.userData.email) {
          let emailTaken = await isEmailTaken(req.body.userData.email);
          if (emailTaken) {
            req.logger.info(
              "Failed to edit user, email already exists in the DB",
              {
                user_id: req.body.userData._id,
                initiator_id: req.headers.validatedToken._id,
              }
            );
            res.status(409).send("Email already taken");
            return;
          }
        }
        if (req.body.userData.password) {
          var updatePasswordQuery = {
            password: await bcrypt.hash(req.body.userData.password, 10),
          };
        }

        let response = await User.updateOne(
          { _id: req.body.userData._id },
          { $set: { ...req.body.userData, ...updatePasswordQuery } }
        );
        req.logger.info("Successfully edited user", {
          user_id: req.body.userData._id,
          initiator_id: req.headers.validatedToken._id,
        });
        res.status(200).send(response);
      } else {
        req.logger.info("Failed to edit user, missing privileges", {
          user_id: req.body.userData._id,
          initiator_id: req.headers.validatedToken._id,
        });
        res.status(403).send("Missing privileges");
      }
    } else {
      req.logger.info("Failed to edit user, user does not exist in the DB", {
        user_id: req.body.userData._id,
        initiator_id: req.headers.validatedToken._id,
      });
      res.status(404).send("User not found");
    }
  } catch (err) {
    next(err);
  }
});

//SEND USER PASSWORD RESET LINK
router.post("/user/forgot-password", async (req, res, next) => {
  try {
    let user = await User.findOne({
      username: req.body.userData.username,
      email: req.body.userData.email,
    });

    if (user) {
      let rawToken = crypto.randomBytes(16).toString("hex");
      let hashToken = crypto
        .createHash("sha256")
        .update(rawToken)
        .digest("hex");

      let token = await Token.create({
        token: hashToken,
        type: "password_reset",
        user: user._id,
      });
      req.logger.info("Created a password reset token", {
        user_id: user._id,
      });

      req.logger.info(
        "Sending an email with a password reset token to the user",
        {
          user_id: user._id,
        }
      );
      await emailUserPasswordReset(user._id, rawToken);
    } else {
      req.logger.info(
        "Failed to create a password reset token, username and email combination does not exist in the DB",
        {
          username: req.body.userData.username,
        }
      );
    }
    res.status(200).send(true);
  } catch (err) {
    next(err);
  }
});

//FORGOT USERNAME
router.post("/user/forgot-username", async (req, res, next) => {
  try {
    let user = await User.findOne({
      email: req.body.userData.email,
    });

    if (user) {
      req.logger.info("Sending an email with the username to the user", {
        user_id: user._id,
      });
      await emailUserUsername(user._id);
    } else {
      req.logger.info(
        "Failed to recover username, email does not exist in the DB"
      );
    }
    res.status(200).send(true);
  } catch (err) {
    next(err);
  }
});

//RESET USER PASSWORD
router.post("/user/reset-password", async (req, res, next) => {
  try {
    if (!req.body.token) {
      req.logger.info("Failed to reset password, reset token is missing");
      res.status(400).send("Missing reset token.");
      return;
    }

    const resetToken = await Token.findOne({
      type: "password_reset",
      token: crypto.createHash("sha256").update(req.body.token).digest("hex"),
    });

    if (resetToken) {
      const user = await User.findOneAndUpdate(
        { _id: resetToken.user },
        { password: await bcrypt.hash(req.body.password, 10) }
      );

      if (user) {
        req.logger.info("Successfully reset user password", {
          user_id: resetToken.user,
        });
      } else {
        req.logger.info(
          "Failed to reset user password, user no longer exists in the DB",
          {
            user_id: resetToken.user,
          }
        );
        res.status(410).send("User no longer exists.");
        return;
      }

      await Token.deleteMany({ type: "password_reset", user: resetToken.user });
      req.logger.info("Deleted used password reset token from the DB", {
        user_id: resetToken.user,
      });
      res.status(200).send();
    } else {
      req.logger.info(
        "Failed to reset user password, reset token expired or invalid"
      );
      res
        .status(401)
        .send("Failed to reset password.\nReset link expired or invalid.");
    }
  } catch (err) {
    next(err);
  }
});

// GET USERS KPI DATA FOR ADMIN PANEL KPI
router.get("/kpi-data", async (req, res, next) => {
  try {
    const users_by_roles = await User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
        },
      },
    ]);

    let users_by_roles_counts = {};
    users_by_roles.forEach((role) => {
      users_by_roles_counts[role._id] = role.count;
    });

    let total_users = Object.values(users_by_roles_counts).reduce(
      (accumulator, value) => {
        return accumulator + value;
      },
      0
    );

    users_by_roles_counts["total"] = total_users;

    req.logger.info("Sending users kpi data");
    res.status(200).json(users_by_roles_counts);
  } catch (err) {
    next(err);
  }
});
export default router;
