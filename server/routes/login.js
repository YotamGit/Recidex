const express = require("express");

const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// const hashPassword =
//   "$2a$10$HAkbn4j5Zt0aOTEK6juDkOz7wEZOpDc60bBgrK2i2VTmPItii5G56";

// Routes

// GET X RECIPES FROM GIVEN DATE WITH FILTERS
router.post("/", async (req, res, next) => {
  try {
    const correctPassword = req.cookies.password
      ? await bcrypt.compare(req.cookies.password, hashPassword)
      : false;

    if (correctPassword) {
      res.status(200).send(correctPassword);
      console.log(`Successful Login Attempt at ${new Date()}`);
    } else {
      res.status(401).send(correctPassword);
      console.log(`Failed Login Attempt at ${new Date()}`);
    }
  } catch (err) {
    next(err);
  }
});
router.post("/signup", async (req, res, next) => {
  try {
    let usernameAlreadyExists = await User.findOne({
      username: { $eq: req.body.username },
    });
    if (usernameAlreadyExists) {
      console.log(
        `Failed to Create User ${
          req.body.username
        } at ${new Date()}, User Already Exists`
      );

      res.status(409).send("The User already exists. Try a different Username");
    } else {
      let hashedPassword = await bcrypt.hash(req.body.password, 10);
      const newUser = await User.create({
        role: "member",
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        password: hashedPassword,
      });
      res.status(200).json(newUser); //return token
      console.log(`User ${req.body.username} Created at ${new Date()}`);
    }
    // User.deleteMany({}).exec();//delete all users
    // var users = await User.find({}); // get all users
    // console.log(users);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
