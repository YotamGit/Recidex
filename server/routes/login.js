const express = require("express");

const router = express.Router();
const bcrypt = require("bcryptjs");

const hashPassword =
  "$2a$10$HAkbn4j5Zt0aOTEK6juDkOz7wEZOpDc60bBgrK2i2VTmPItii5G56";

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

module.exports = router;
