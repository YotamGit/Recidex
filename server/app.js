const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv/config");

// Middlewares
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use("*", (req, res, next) => {
  console.log(`\n${Date()} - ${req.method} Request, Url: ${req.originalUrl}`);
  next();
});

// Import Routes
const recipesRoute = require("./routes/recipes");
app.use("/api/recipes", recipesRoute);

// Connect To DB
mongoose.connect(process.env.DB_CONNECTION, () =>
  console.log("Connected to DB")
);

app.listen(3001);
