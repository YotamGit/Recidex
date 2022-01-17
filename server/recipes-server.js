const express = require("express");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");

const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv/config");

const hashPassword =
  "$2a$10$HAkbn4j5Zt0aOTEK6juDkOz7wEZOpDc60bBgrK2i2VTmPItii5G56";

const authenticate = async (req, res, logMessage, next) => {
  try {
    const correctPassword = req.cookies.password
      ? await bcrypt.compare(req.cookies.password, hashPassword)
      : false;
    if (correctPassword) {
      next();
    } else {
      res.status(401);
      res.json("Unauthorized, Login Required.");
      console.log(logMessage);
    }
  } catch (err) {
    res.json({ message: err });
  }
};
// Middlewares
app.use(cors());
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use("*", (req, res, next) => {
  console.log(`\n${Date()} - ${req.method} Request, Url: ${req.originalUrl}`);
  next();
});

// Authentication Middlewares
app.post("/api/recipes/new", async (req, res, next) => {
  authenticate(
    (req = req),
    (res = res),
    `\n${Date()} - Unauthorized Post attempt at /api/recipes/new`,
    (next = next)
  );
});
app.delete("/api/recipes/*", async (req, res, next) => {
  authenticate(
    (req = req),
    (res = res),
    `\n${Date()} - Unauthorized Delete attempt at /api/recipes/`,
    (next = next)
  );
});
app.patch("/api/recipes/*", async (req, res, next) => {
  authenticate(
    (req = req),
    (res = res),
    (logMessage = `\n${Date()} - Unauthorized patch attempt at /api/recipes/`),
    (next = next)
  );
});

// Import Routes
const loginRoute = require("./routes/login");
app.use("/api/login", loginRoute);

const recipesRoute = require("./routes/recipes");
app.use("/api/recipes", recipesRoute);

// Connect To DB
mongoose.connect("mongodb://localhost:27017/Recipes", () =>
  console.log("Connected to DB")
);

// Start Server
app.listen(3001, () => {
  console.log("Recipe Server up");
});
