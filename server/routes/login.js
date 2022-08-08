import express from "express";

const router = express.Router();
import { User } from "../models/User.js";
import bcrypt from "bcryptjs";

import {
  generateToken,
  validateToken,
  isEmailTaken,
  isUsernameTaken,
} from "../utils-module/authentication.js";
import { emailNewUser } from "../utils-module/notifications.js";

// Routes

// a route to check if a given token is valid and authenticate the user
router.post("/ping", async (req, res, next) => {
  try {
    let validatedToken = validateToken(req.cookies.userToken);
    if (validatedToken) {
      let user = await User.findById(validatedToken._id).select({
        _id: 1,
        role: 1,
        username: 1,
        firstname: 1,
        lastname: 1,
        email: 1,
      });
      if (
        validatedToken.role !== user.role ||
        validatedToken.lastname !== user.lastname ||
        validatedToken.firstname !== user.firstname
      ) {
        res.status(409).json({
          token: generateToken(user),
          userData: user,
        });
      }

      res.status(200).json({
        authenticated: true,
        userData: user,
      });
    } else {
      res.status(401).json({ authenticated: false });
    }
  } catch (err) {
    next(err);
  }
});

// sign in a user and send back a jwt
router.post("/", async (req, res, next) => {
  try {
    let user = await User.findOne({
      username: { $eq: req.body.username },
    });
    if (user) {
      const correctPassword = req.body.password
        ? await bcrypt.compare(req.body.password, user.password)
        : false;

      if (correctPassword) {
        //update login time of user
        const response = await User.updateOne(
          { _id: user._id },
          {
            $set: {
              last_sign_in: Date.now(),
            },
          }
        );
        res.status(200).json({
          token: generateToken(user),
          userData: {
            _id: user._id,
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            role: user.role,
          },
        });
      } else {
        res.status(401).send(false);
      }
    } else {
      res.status(401).send(false);
    }
  } catch (err) {
    next(err);
  }
});

// sign up a user and then send back a jwt
router.post("/signup", async (req, res, next) => {
  try {
    let usernameTaken = await isUsernameTaken(req.body.username);
    if (usernameTaken) {
      res.status(409).send("The User already exists. Try a different Username");
      return;
    }
    let emailTaken = await isEmailTaken(req.body.email);
    if (emailTaken) {
      res.status(409).send("Email has already been taken. Try a different one");
      return;
    }

    let hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = await User.create({
      role: "member",
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      username: req.body.username,
      password: hashedPassword,
      notifications_opt_in: req.body.notifications_opt_in,
    });
    res.status(200).json({
      token: generateToken(newUser),
      userData: {
        username: newUser.username,
        firstname: newUser.firstname,
        lastname: newUser.lastname,
        _id: newUser._id,
        role: newUser.role,
        email: newUser.email,
      },
    });

    await emailNewUser(newUser._id);
  } catch (err) {
    next(err);
  }
});

export default router;
