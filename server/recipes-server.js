const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const bcrypt = require("bcryptjs");
const cors = require("cors");

const app = express();
const mongoose = require("mongoose");

const authUtils = require("./utils-module").Auth;

dotenv.config();

// Middlewares
app.use(cors());
app.use(cookieParser());
app.use(express.json({ limit: "50mb" })); //parse requests
app.use(mongoSanitize());
app.use("*", (req, res, next) => {
  console.log(`\n${Date()} - ${req.method} Request, Url: ${req.originalUrl}`);
  next();
});

// Authentication Middlewares
app.post("/api/recipes/new", authUtils.authenticateUser);
app.post("/api/recipes/delete/*", authUtils.authenticateUser);
app.post("/api/recipes/edit/*", authUtils.authenticateUser);
app.post("/api/recipes/edit/favorite/*", authUtils.authenticateUser);

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
