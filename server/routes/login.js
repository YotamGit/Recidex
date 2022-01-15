const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const hashPassword =
  "$2a$10$HAkbn4j5Zt0aOTEK6juDkOz7wEZOpDc60bBgrK2i2VTmPItii5G56";

// Routes

// GET X RECIPES FROM GIVEN DATE WITH FILTERS
router.get("/", async (req, res) => {
  try {
    const correctPassword = await bcrypt.compare(
      req.query.password,
      hashPassword
    );
    res.json(correctPassword);
    if (correctPassword) {
      console.log(`Successful Login Attempt at ${new Date()}`);
    } else {
      console.log(`Failed Login Attempt at ${new Date()}`);
    }
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;
