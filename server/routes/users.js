import express from "express";

const router = express.Router();
import { User } from "../models/User.js";
import { Recipe } from "../models/Recipe.js";
import {
  isAdminUser,
  isModeratorUser,
  isAllowedToEditUser,
  isEmailTaken,
  isUsernameTaken,
} from "../utils-module/authentication.js";

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

//GET A SPECIFIC USER PROFILE DATA
router.get("/user/info/:user_id", async (req, res, next) => {
  try {
    let userInfo = await User.findById(req.params.user_id).select(
      "firstname lastname registration_date"
    );

    if (userInfo) {
      res.status(200).json({ userInfo });
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
        let response = await User.updateOne(
          { _id: req.body.userData._id },
          { $set: req.body.userData }
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

export default router;
