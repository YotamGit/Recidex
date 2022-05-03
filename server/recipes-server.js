import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
import cors from "cors";

const app = express();
import mongoose from "mongoose";

import { authenticateUser } from "./utils-module/authentication.js";

//route imports
import loginRoute from "./routes/login.js";
import recipesRoute from "./routes/recipes.js";
import usersRoute from "./routes/users.js";

dotenv.config();

// Middlewares
app.use(cors());
app.use(cookieParser());
// for parsing application/json
app.use(express.json({ limit: "50mb" }));
// for parsing application/xwww-
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(mongoSanitize());
app.use("*", (req, res, next) => {
  let startTime = performance.now();
  next();
  res.on("finish", () => {
    process.stdout.write(
      `\n${new Date().toISOString()} ${req.method} ${req.originalUrl}`
    );
    let endTime = performance.now();
    process.stdout.write(
      ` ${res.statusCode} ${Math.round(endTime - startTime)}ms`
    );
  });
});

// Authentication
app.post("/api/recipes/new", authenticateUser);
app.post("/api/recipes/delete/*", authenticateUser);
app.post("/api/recipes/edit/*", authenticateUser);
app.post("/api/recipes/edit/favorite/*", authenticateUser);

app.post("/api/users/user/delete", authenticateUser);
app.post("/api/users/user/privileges", authenticateUser);

// Route middlewares
app.use("/api/login", loginRoute);
app.use("/api/recipes", recipesRoute);
app.use("/api/users", usersRoute);

app.use("*", (req, res) => {
  res.status(404).send();
});

// Error handler
app.use((err, req, res, next) => {
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
