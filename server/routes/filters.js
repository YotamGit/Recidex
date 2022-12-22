import express from "express";

const router = express.Router();
import {
  RECIPE_VALUES,
  PRIVACY_VALUES,
  SORT_FIELDS,
} from "../models/Recipe.js";

// Routes

// GET RECIPE FILTERING OPTIONS FOR SELECTORS(CATEGORIES, DIFFICULTIES, DURATIONS)
router.get("/recipe-filter-values", async (req, res, next) => {
  try {
    req.logger.info("Sending recipe categorical values");
    res.status(200).send(RECIPE_VALUES);
  } catch (err) {
    next(err);
  }
});

// GET RECIPE PRIVACY OPTIONS FOR SELECTORS
router.get("/recipe-privacy-values", async (req, res, next) => {
  try {
    req.logger.info("Sending recipe privacy values");
    res.status(200).send(PRIVACY_VALUES);
  } catch (err) {
    next(err);
  }
});

// GET RECIPE FIELDS YOU CAN SORT BY
router.get("/recipe-sort-fields", async (req, res, next) => {
  try {
    req.logger.info("Sending recipe sorting fields");
    res.status(200).send(SORT_FIELDS);
  } catch (err) {
    next(err);
  }
});

export default router;
