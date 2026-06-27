import express from "express";

const router = express.Router();

import {
  Ingredient,
  IngredientCategories,
  IngredientMeasurementUnits,
  IngredientPrepMethods,
  IngredientDimensionConversion,
} from "../models/Ingredient.js";

// Routes

//get ingredients
router.get("/", async (req, res, next) => {
  try {
    const ingredients = await Ingredient.find({});
    req.logger.info("Sending ingredients data");
    res.status(200).json(ingredients);
  } catch (err) {
    next(err);
  }
});

//get ingredient categories
router.get("/categories", async (req, res, next) => {
  try {
    const ingredientCategories = await IngredientCategories.find({});
    req.logger.info("Sending ingredient categories data");
    res.status(200).json(ingredientCategories);
  } catch (err) {
    next(err);
  }
});

//get preparation methods
router.get("/prep-methods", async (req, res, next) => {
  try {
    const ingredientPrepMethods = await IngredientPrepMethods.find({});
    req.logger.info("Sending ingredient prep methods data");
    res.status(200).json(ingredientPrepMethods);
  } catch (err) {
    next(err);
  }
});

//get dimension conversions
router.get("/dimension-conversion", async (req, res, next) => {
  try {
    const ingredientDimensionConversion =
      await IngredientDimensionConversion.find({});
    req.logger.info("Sending ingredient dimension conversion data");
    res.status(200).json(ingredientDimensionConversion);
  } catch (err) {
    next(err);
  }
});

//get measurement units
router.get("/measurement-units", async (req, res, next) => {
  try {
    const ingredientMeasurementUnits = await IngredientMeasurementUnits.find(
      {},
    );
    req.logger.info("Sending ingredient measurement units data");
    res.status(200).json(ingredientMeasurementUnits);
  } catch (err) {
    next(err);
  }
});

export default router;
