const express = require("express");
const router = express.Router();
const Recipe = require("../models/Recipe");
const {
  authenticateRecipeOwnership,
} = require("../utils-module/lib/authentication");

// Routes

// GET X RECIPES FROM GIVEN DATE WITH FILTERS
router.get("/", async (req, res, next) => {
  var startTime = performance.now();
  try {
    if (Object.keys(req.query).length > 0) {
      const recipes = await Recipe.find({
        creation_time: { $lt: req.query.latest },
        ...JSON.parse(req.query.filters || "{}"),
      })
        .sort({ creation_time: -1 })
        .limit(parseInt(req.query.count));
      res.sentCount = Object.keys(recipes).length;
      res.status(200).json(recipes);
    } else {
      const recipes = await Recipe.find().sort({ creation_time: -1 });
      res.status(200).json(recipes);
    }

    var endTime = performance.now();
    console.log(
      `Sending ${res.sentCount} Recipes took ${
        endTime - startTime
      } milliseconds`
    );
  } catch (err) {
    next(err);
  }
});

// GET BACK A SPECIFIC RECIPE
// router.get("/:recipe_id", async (req, res, next) => {
//   try {
//     const recipe = await Recipe.findById(req.params.recipe_id);
//     res.status(200).json(recipe);
//   } catch (err) {
//     next(err);
//   }
// });

// SUBMIT A NEW RECIPE
router.post("/new", async (req, res, next) => {
  var startTime = performance.now();

  try {
    const savedRecipe = await Recipe.create({
      ...req.body.recipe,
      owner: req.body.headers.validatedToken.userId,
    });
    res.status(200).json(savedRecipe);

    var endTime = performance.now();
    console.log(`Adding new Recipe took ${endTime - startTime} milliseconds`);
  } catch (err) {
    next(err);
  }
});

// DELETE A SPECIFIC RECIPE
router.post("/delete/:recipe_id", async (req, res, next) => {
  try {
    console.log(req.params);
    const recipe = await Recipe.findById(req.params.recipe_id);
    const isOwner = authenticateRecipeOwnership(
      req.body.headers.validatedToken,
      recipe
    );
    console.log(isOwner);
    if (isOwner) {
      var startTime = performance.now();

      const response = await Recipe.deleteOne({ _id: req.params.recipe_id });
      res.status(200).json(response);
      var endTime = performance.now();
      console.log(`Deleting Recipe took ${endTime - startTime} milliseconds`);
    } else {
      res
        .status(401)
        .send("Cannot delete recipe. You are not the Owner of this Recipe");
    }
  } catch (err) {
    next(err);
  }
});

// UPDATE A SPECIFIC RECIPE
router.patch("/:recipe_id", async (req, res, next) => {
  var startTime = performance.now();
  try {
    const response = await Recipe.updateOne(
      { _id: req.params.recipe_id },
      { $set: { ...req.body, last_update_time: Date.now() } }
    );
    res.status(200).json(response);

    var endTime = performance.now();
    console.log(`Updating Recipe took ${endTime - startTime} milliseconds`);
  } catch (err) {
    next(err);
  }
});
module.exports = router;
