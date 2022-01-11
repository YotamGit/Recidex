const express = require("express");
const router = express.Router();
const Recipe = require("../models/Recipe");

// Routes

// GET X RECIPES FROM GIVEN DATE
router.get("/", async (req, res) => {
  var startTime = performance.now();
  try {
    if (Object.keys(req.query).length > 0) {
      console.log(req.query);
      const recipes = await Recipe.find({
        creation_time: { $lt: req.query.latest },
      })
        .sort({ creation_time: -1 })
        .limit(parseInt(req.query.count));

      res.json(recipes);
    } else {
      const recipes = await Recipe.find()
        .sort({ creation_time: -1 })
        .limit(parseInt(req.query.count));
      res.json(recipes);
    }
  } catch (err) {
    res.json({ message: err });
  }
  var endTime = performance.now();

  console.log(
    `Sending ${req.query.count} Recipes took ${
      endTime - startTime
    } milliseconds`
  );
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

  const record = req.body;
  try {
    const savedRecipe = await Recipe.create(record);
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
    const response = await Recipe.deleteOne({ _id: req.params.recipe_id });
    res.json(response);
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
    const response = await Recipe.updateOne(
      { _id: req.params.recipe_id },
      { $set: { ...req.body, last_update_time: Date.now() } }
    );
    res.json(response);
  } catch (err) {
    res.json({ message: err });
  }

  var endTime = performance.now();
  console.log(`Updating Recipe took ${endTime - startTime} milliseconds`);
});
module.exports = router;
