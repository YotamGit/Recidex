const express = require("express");
const sanitizeHtml = require("sanitize-html");
const router = express.Router();
const Recipe = require("../models/Recipe");
const {
  authenticateRecipeOwnership,
} = require("../utils-module/lib/authentication");

// Routes

// GET X RECIPES FROM GIVEN DATE WITH FILTERS
router.get("/", async (req, res, next) => {
  try {
    if (Object.keys(req.query).length > 0) {
      var favoritesOnlyQuery =
        req.query.favoritesOnly === "true"
          ? { favorited_by: req.query.userId }
          : {};

      var textSearchQuery = req.query?.searchText
        ? { title: { $regex: req.query.searchText, $options: "mi" } }
        : {};

      let recipes = await Recipe.find({
        creation_time: { $lt: req.query.latest },
        ...textSearchQuery,
        ...favoritesOnlyQuery,
        ...JSON.parse(req.query.filters),
      })
        .populate("owner", "firstname lastname")
        .sort({ creation_time: -1 })
        .limit(parseInt(req.query.count));

      res.sentCount = Object.keys(recipes).length;
      res.status(200).json(recipes);
    } else {
      const recipes = await Recipe.find().sort({ creation_time: -1 });
      res.status(200).json(recipes);
    }
  } catch (err) {
    next(err);
  }
});

// GET BACK A SPECIFIC RECIPE
router.get("/id/:recipe_id", async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.recipe_id);
    res.status(200).json(recipe);
  } catch (err) {
    next(err);
  }
});

// GET ALL RECIPE TITLES
router.get("/titles", async (req, res, next) => {
  try {
    const titles = await Recipe.find({}).distinct("title");
    res.status(200).send(titles);
  } catch (err) {
    next(err);
  }
});

// SUBMIT A NEW RECIPE
router.post("/new", async (req, res, next) => {
  try {
    //sanitize html
    req.body.recipe.description = sanitizeHtml(req.body.recipe.description);
    req.body.recipe.ingredients = sanitizeHtml(req.body.recipe.ingredients);
    req.body.recipe.directions = sanitizeHtml(req.body.recipe.directions);

    const savedRecipe = await Recipe.create({
      ...req.body.recipe,
      owner: req.body.headers.validatedToken.userId,
    });

    // find the recipe again in order to populate the owner with the names and send it to the client
    res
      .status(200)
      .json(
        await Recipe.findById(savedRecipe._id).populate(
          "owner",
          "firstname lastname"
        )
      );
  } catch (err) {
    next(err);
  }
});

// DELETE A SPECIFIC RECIPE
router.post("/delete/:recipe_id", async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.recipe_id);
    const isOwner = await authenticateRecipeOwnership(
      req.body.headers.validatedToken,
      recipe
    );
    if (isOwner) {
      const response = await Recipe.deleteOne({ _id: req.params.recipe_id });
      res.status(200).json(response);
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
router.post("/edit/:recipe_id", async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.recipe_id);
    const isOwner = await authenticateRecipeOwnership(
      req.body.headers.validatedToken,
      recipe
    );
    if (isOwner) {
      //sanitize html
      req.body.recipeData.description = sanitizeHtml(
        req.body.recipeData.description
      );
      req.body.recipeData.ingredients = sanitizeHtml(
        req.body.recipeData.ingredients
      );
      req.body.recipeData.directions = sanitizeHtml(
        req.body.recipeData.directions
      );

      //delete certain fields for security reasons(other fields are limited b)
      delete req.body.recipeData.creation_time;
      delete req.body.recipeData.last_update_time;
      delete req.body.recipeData.owner;
      delete req.body.recipeData.favorited_by;

      const response = await Recipe.updateOne(
        { _id: req.params.recipe_id },
        {
          $set: {
            ...req.body.recipeData,
            last_update_time: Date.now(),
          },
        }
      );

      res.status(200).json(response);
    } else {
      res
        .status(401)
        .send("Cannot edit recipe. You are not the Owner of this Recipe");
    }
  } catch (err) {
    next(err);
  }
});

// FAVORITE A RECIPE FOR A USER
router.post("/edit/favorite/:recipe_id", async (req, res, next) => {
  try {
    const users = (await Recipe.findById({ _id: req.params.recipe_id }))
      .favorited_by;
    var index = users.indexOf(req.body.headers.validatedToken.userId);
    switch (req.body.favorite) {
      case true:
        if (index < 0) {
          users.push(req.body.headers.validatedToken.userId);
          await Recipe.updateOne(
            { _id: req.params.recipe_id },
            { favorited_by: users }
          );
        }
        res.status(200).json(users);
        break;
      case false:
        if (index >= 0) {
          users.splice(index, 1);
          await Recipe.updateOne(
            { _id: req.params.recipe_id },
            { favorited_by: users }
          );
        }
        res.status(200).json(users);
        break;
      default:
        res.status(400).send("favorite field is missing or not boolean");
    }
  } catch (err) {
    next(err);
  }
});
module.exports = router;
