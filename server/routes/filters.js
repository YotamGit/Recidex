import express from "express";

const router = express.Router();
import { recipeValues, privacyValues, sortFields } from "../models/Recipe.js";

// Routes

// GET RECIPE FILTERING OPTIONS FOR SELECTORS(CATEGORIES, DIFFICULTIES, DURATIONS)
router.get("/recipe-filter-values", async (req, res, next) => {
  try {
    res.status(200).send(recipeValues);
  } catch (err) {
    next(err);
  }
});

// GET RECIPE PRIVACY OPTIONS FOR SELECTORS
router.get("/recipe-privacy-values", async (req, res, next) => {
  try {
    res.status(200).send(privacyValues);
  } catch (err) {
    next(err);
  }
});

// GET RECIPE FIELDS YOU CAN SORT BY
router.get("/recipe-sort-fields", async (req, res, next) => {
  try {
    res.status(200).send(sortFields);
  } catch (err) {
    next(err);
  }
});

export default router;
