const express = require("express");
const router = express.Router();
const Recipe = require("../models/Recipe");

// Routes

// GET BACK ALL THE RECIPES
router.get("/", async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (err) {
    res.json({ message: err });
  }
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
});

// DELETE A SPECIFIC RECIPE
router.delete("/:recipe_id", async (req, res) => {
  try {
    const removedRecipe = await Recipe.deleteOne({ _id: req.params.recipe_id });
    res.json(removedRecipe);
  } catch (err) {
    res.json({ message: err });
  }
});

// UPDATE A SPECIFIC RECIPE
router.patch("/:recipe_id", async (req, res) => {
  try {
    const updatedRecipe = await Recipe.updateOne(
      { _id: req.params.recipe_id },
      { $set: { ...req.body, last_update_time: Date.now() } }
    );
    res.json(updatedRecipe);
  } catch (err) {
    res.json({ message: err });
  }
});
module.exports = router;
