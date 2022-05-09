import express from "express";
import sanitizeHtml from "sanitize-html";
const router = express.Router();
import { Recipe } from "../models/Recipe.js";
import { authenticateRecipeOwnership } from "../utils-module/authentication.js";
import { reduceImgQuality } from "../utils-module/images.js";

// Routes

// GET X RECIPES FROM GIVEN DATE WITH FILTERS
router.get("/", async (req, res, next) => {
  try {
    if (Object.keys(req.query).length > 0) {
      let favoritesOnlyQuery =
        req.query.favoritesOnly === "true"
          ? { favorited_by: req.query.userId }
          : {};

      let textSearchQuery = req.query?.searchText
        ? { title: { $regex: req.query.searchText, $options: "mi" } }
        : {};

      let recipes = await Recipe.find({
        creation_time: { $lt: req.query.latest },
        ...textSearchQuery,
        ...favoritesOnlyQuery,
        ...JSON.parse(req.query.filters),
      })
        .select("-image")
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
    const recipe = await Recipe.findById(req.params.recipe_id)
      .select("-image")
      .populate("owner", "firstname lastname");
    res.status(200).json(recipe);
  } catch (err) {
    next(err);
  }
});

// GET BACK A SPECIFIC RECIPE IMAGE
router.get("/image/:recipe_id", async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.recipe_id).select([
      "image",
      "-_id",
    ]);

    res
      .status(200)
      .set({ "Content-Type": "image/webp" })
      .send(new Buffer.from(recipe.image));
  } catch (err) {
    res.status(204).send("No Image Found");
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

// GET RECIPE COUNT
router.get("/count", async (req, res, next) => {
  try {
    const recipes = await Recipe.find({}).distinct("_id");
    res.status(200).send(recipes.length.toString());
  } catch (err) {
    next(err);
  }
});

// SUBMIT A NEW RECIPE
router.post("/new", async (req, res, next) => {
  try {
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

    //reduce image quality if present
    if (req.body.recipeData.image) {
      try {
        req.body.recipeData.image = await reduceImgQuality(
          req.body.recipeData.image
        );
      } catch (err) {
        res.status(400).send("Cannot edit recipe. Invalid Image");
      }
    }

    const savedRecipe = await Recipe.create({
      ...req.body.recipeData,
      owner: req.headers.validatedToken._id,
    });
    delete savedRecipe.image;
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
      req.headers.validatedToken,
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
      req.headers.validatedToken,
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

      //reduce image quality if present
      if (req.body.recipeData.image) {
        try {
          req.body.recipeData.image = await reduceImgQuality(
            req.body.recipeData.image
          );
        } catch (err) {
          res.status(400).send("Cannot edit recipe. Invalid Image");
        }
      } else if (req.body.recipeData.image === false) {
        //false means the image is to be deleted
        req.body.recipeData.image = null;
      }

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
    let index = users.indexOf(req.headers.validatedToken._id);
    switch (req.body.favorite) {
      case true:
        if (index < 0) {
          users.push(req.headers.validatedToken._id);
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
export default router;
