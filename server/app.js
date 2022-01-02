const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv/config");

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Import Routes
const recipesRoute = require("./routes/recipes");
app.use("/api/recipes", recipesRoute);

app.get("/", (req, res) => {
  res.send("we are on home");
});

// Connect To DB
mongoose.connect(process.env.DB_CONNECTION, () =>
  console.log("Connected to DB")
);

app.listen(3000);
