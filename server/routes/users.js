import express from "express";

const router = express.Router();
import { User } from "../models/User.js";
import { Recipe } from "../models/Recipe.js";
import {
  isAdminUser,
  isModeratorUser,
  isAllowedToEditUser,
} from "../utils-module/authentication.js";

// Routes

//GET ALL USERS
router.get("/", async (req, res, next) => {
  try {
    let isModerator = await isModeratorUser(req.headers.validatedToken);
    if (isModerator) {
      let users = await User.find({
        _id: { $ne: req.headers.validatedToken.userId },
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

//DELETE A USER
router.post("/user/delete", async (req, res, next) => {
  try {
    let user = await User.findById(req.body.id);
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

//CHANGE USER PRIVILEGES
router.post("/user/privileges", async (req, res, next) => {
  try {
    let isAdmin = await isAdminUser(req.headers.validatedToken);
    if (isAdmin) {
      let updatedUser = await User.findByIdAndUpdate(
        { _id: userData.id },
        { $set: { role: userData.role } }
      );

      if (updatedUser) {
        res.status(200).send(updatedUser);
      } else {
        res.status(404).send("User not found");
      }
    } else {
      res.status(403).send("Missing privileges");
    }
  } catch (err) {
    next(err);
  }
});

export default router;
