import express from "express";

const router = express.Router();
import { User } from "../models/User.js";
import {
  isAdminUser,
  isModeratorUser,
  isAllowedToEditUser,
} from "../utils-module/authentication.js";

// Routes

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
// router.post("/user/privileges", async (req, res, next) => {
//   try {
//     // let response = await User.findOneAndUpdate({ _id: req.body.id }, {$set:{role:}});

//     if (!response) {
//       res.status(404).send("User does not exist");
//     }

//     res.status(200).send(response);
//   } catch (err) {
//     next(err);
//   }
// });

export default router;
