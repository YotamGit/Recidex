const express = require("express");

const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const authUtils = require("../utils-module/").Auth;

// Routes

// sign in a user and send back a jwt
router.post("/", async (req, res, next) => {
  try {
    let user = await User.findOne({ username: { $eq: req.body.username } });
    if (user) {
      const correctPassword = req.body.password
        ? await bcrypt.compare(req.body.password, user.password)
        : false;

      if (correctPassword) {
        res.status(200).json({
          token: authUtils.generateToken(user),
          userData: {
            firstname: user.firstname,
            lastname: user.lastname,
            userId: user.userId,
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

// a route to check if a given token is valid
router.post("/ping", async (req, res, next) => {
  try {
    let validatedToken = authUtils.validateToken(
      req.body.headers.Authentication
    );
    if (validatedToken) {
      res.status(200).json({
        authenticated: true,
        userData: {
          firstname: validatedToken.firstname,
          lastname: validatedToken.lastname,
          userId: validatedToken.userId,
        },
      });
    } else {
      res.status(401).json({ authenticated: false });
    }
  } catch (err) {
    next(err);
  }
});

// sign up a user and then send back a jwt
router.post("/signup", async (req, res, next) => {
  try {
    let usernameAlreadyExists = await User.findOne({
      username: { $eq: req.body.username },
    });
    if (usernameAlreadyExists) {
      res.status(409).send("The User already exists. Try a different Username");
    } else {
      let hashedPassword = await bcrypt.hash(req.body.password, 10);
      const newUser = await User.create({
        role: "member",
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        username: req.body.username,
        password: hashedPassword,
      });

      res.status(200).json({
        token: authUtils.generateToken(newUser),
        userData: {
          userId: newUser._id,
        },
      });
    }
    // User.deleteMany({}).exec();//delete all users
    // var users = await User.find({}); // get all users
    // console.log(users);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
