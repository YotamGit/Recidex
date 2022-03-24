const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");

const app = express();
const mongoose = require("mongoose");
const cors = require("cors");

const authUtils = require("./utils-module").Auth;

dotenv.config();

const hashPassword =
  "$2a$10$HAkbn4j5Zt0aOTEK6juDkOz7wEZOpDc60bBgrK2i2VTmPItii5G56";

const authenticate = async (req, res, next) => {
  try {
    const correctPassword = req.cookies.password
      ? await bcrypt.compare(req.cookies.password, hashPassword)
      : false;
    if (correctPassword) {
      next();
    } else {
      res.status(401).send("Unauthorized, Login Required.");
      console.log(
        `\n${Date()} - Unauthorized ${req.method} Request, Url: ${
          req.originalUrl
        }`
      );
    }
  } catch (err) {
    next(err);
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
app.post("/api/recipes/new", authenticate);
app.delete("/api/recipes/*", authenticate);
app.patch("/api/recipes/*", authenticate);

// Import Routes
const loginRoute = require("./routes/login");
app.use("/api/login", loginRoute);

const recipesRoute = require("./routes/recipes");
app.use("/api/recipes", recipesRoute);

app.use("*", (req, res) => {
  res.status(404).send();
});

// Error handler
app.use((err, req, res) => {
  res.status(500).send(err);
});
// Connect To DB
mongoose.connect("mongodb://localhost:27017/Recipes", () =>
  console.log("Connected to DB")
);

// Start Server
let PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Recipe Server is up and running on ${PORT}`);
});
