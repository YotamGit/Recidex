const express = require("express");
const router = express.Router();
const Recipe = require("../models/Recipe");

// Routes

// GET BACK ALL THE RECIPES
router.get("/", async (req, res) => {
  var startTime = performance.now();
  try {
    const recipes = await Recipe.find();

    res.json(recipes);
  } catch (err) {
    res.json({ message: err });
  }
  var endTime = performance.now();

  console.log(`Sending all Recipes took ${endTime - startTime} milliseconds`);
});

// GET BACK A SPECIFIC RECIPE
router.get("/:recipe_id", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipe_id);
    res.json(recipe);
  } catch (err) {
    res.json({ message: err });
  }
});

// SUBMIT A NEW RECIPE
router.post("/new", async (req, res) => {
  var startTime = performance.now();
  const recipe = new Recipe({
    title: req.body.title,
    category: req.body.category,
    difficulty: req.body.difficulty,
    duration: req.body.duration,
    description: req.body.description,
    ingredients: req.body.ingredients,
    directions: req.body.directions,
    rtl: req.body.rtl,
    source: req.body.source,
    imageName: req.body.imageName,
    image: req.body.image,
  });

  try {
    const savedRecipe = await recipe.save();
    res.json(savedRecipe);
  } catch (err) {
    res.json({ message: err });
  }
  var endTime = performance.now();
  console.log(`Adding new Recipe took ${endTime - startTime} milliseconds`);
});

// DELETE A SPECIFIC RECIPE
router.delete("/:recipe_id", async (req, res) => {
  var startTime = performance.now();
  try {
    const removedRecipe = await Recipe.deleteOne({ _id: req.params.recipe_id });
    res.json(removedRecipe);
  } catch (err) {
    res.json({ message: err });
  }
  var endTime = performance.now();
  console.log(`Deleting Recipe took ${endTime - startTime} milliseconds`);
});

// UPDATE A SPECIFIC RECIPE
router.patch("/:recipe_id", async (req, res) => {
  var startTime = performance.now();
  try {
    const updatedRecipe = await Recipe.updateOne(
      { _id: req.params.recipe_id },
      { $set: { ...req.body, last_update_time: Date.now() } }
    );
    res.json(updatedRecipe);
  } catch (err) {
    res.json({ message: err });
  }
  var endTime = performance.now();
  console.log(`Updating Recipe took ${endTime - startTime} milliseconds`);
});
module.exports = router;
