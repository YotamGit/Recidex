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
      let users = await User.find({
        _id: { $ne: req.headers.validatedToken._id },
      }).select({
        role: 1,
        username: 1,
        firstname: 1,
        lastname: 1,
        email: 1,
        registration_date: 1,
        last_sign_in: 1,
      });
      res.status(200).send(users);
    } else {
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
      res.status(200).send(false);
      return;
    }

    let userExists = await User.exists({ _id: req.params.user_id });

    if (userExists) {
      res.status(200).send(true);
    } else {
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

      res.status(200).json({
        userInfo,
        metrics: {
          approvedRecipesCount: approvedRecipesCount.length,
          publicRecipesCount: publicRecipesCount.length,
          favoriteRecipesCount: favoriteRecipesCount.length,
        },
      });
    } else {
      res.status(404).send("User not found");
    }
  } catch (err) {
    next(err);
  }
});

//GET A SPECIFIC USER ACCOUNT DATA
router.get("/user/account/info/:user_id", async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.user_id)) {
      res.status(404).send("User not found");
      return;
    }

    let userInfo = await User.findById(req.params.user_id).select(
      "username firstname lastname email role notification_opt_in"
    );

    if (userInfo) {
      res.status(200).json(userInfo);
    } else {
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

        res.status(200).json(deletedUser);
      } else {
        res.status(403).send("Missing privileges");
      }
    } else {
      res.status(404).send("User not found");
    }
  } catch (err) {
    next(err);
  }
});

//EDIT USER DETAILES
router.post("/user/edit", async (req, res, next) => {
  try {
    if (!isValidObjectId(req.body.userData._id)) {
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
            res.status(409).send("Username already exists.");
            return;
          }
        }
        if (userToEdit.email !== req.body.userData.email) {
          let emailTaken = await isEmailTaken(req.body.userData.email);
          if (emailTaken) {
            res.status(409).send("Email already exists");
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
        res.status(200).send(response);
      } else {
        res.status(403).send("Missing privileges");
      }
    } else {
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
      await emailUserPasswordReset(user._id, rawToken);
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
      await emailUserUsername(user._id);
    }
    res.status(200).send(true);
  } catch (err) {
    next(err);
  }
});

// //RESET USER PASSWORD
// router.post("/user/reset-password", async (req, res, next) => {
//   try {
//     if (!req.body.token) {
//       res.status(400).send("Missing reset token.");
//       return;
//     }

//     const resetToken = await Token.findOne({
//       type: "password_reset",
//       token: crypto.createHash("sha256").update(req.body.token).digest("hex"),
//     });

//     console.log(resetToken);
//     let user = await User.findOne({
//       email: req.body.userData.email,
//     });

//     res.status(200).send(true);
//   } catch (err) {
//     next(err);
//   }
// });

export default router;
