import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
import cors from "cors";
import mongoose from "mongoose";

import { authenticateUser } from "./utils-module/authentication.js";

//route imports
import loginRoute from "./routes/login.js";
import recipesRoute from "./routes/recipes.js";
import usersRoute from "./routes/users.js";
import filtersRoute from "./routes/filters.js";

import { morganMiddleware } from "./utils-module/logger.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(cookieParser());

// for parsing application/json
app.use(express.json({ limit: "50mb" }));

// for parsing application/xwww-
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(mongoSanitize());

app.use(morganMiddleware);

// Authentication
app.post("/api/recipes/new", authenticateUser);
app.post("/api/recipes/delete/*", authenticateUser);
app.post("/api/recipes/edit/*", authenticateUser);
app.post("/api/recipes/edit/favorite/*", authenticateUser);
app.post("/api/recipes/edit/approve/*", authenticateUser);

app.get("/api/users", authenticateUser);
app.post("/api/users/user/delete", authenticateUser);
app.post("/api/users/user/edit", authenticateUser);

// Route middlewares
app.use("/api/login", loginRoute);
app.use("/api/recipes", recipesRoute);
app.use("/api/users", usersRoute);
app.use("/api/filters", filtersRoute);

app.use("*", (req, res) => {
  res.status(404).send();
});

// Error handler
app.use((err, req, res, next) => {
  console.log("\n", err);
  res.status(500).send("Internal Server Error");
});

// Connect To DB

const connect = async () => {
  try {
    await mongoose.connect("mongodb://mongodb:27017/Recipes");
    console.log("Connected to DB");
  } catch (error) {
    console.log("Failed to connect to DB", error);
    console.log("Retrying connection to DB");
    await connect();
  }
};

console.log("Connecting to DB");
await connect();

// Start Server
let PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Recipe Server is up and running on ${PORT}`);
});
