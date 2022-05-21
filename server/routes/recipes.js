import express from "express";
import sanitizeHtml from "sanitize-html";
const router = express.Router();
import { Recipe } from "../models/Recipe.js";
import {
  authenticateRecipeOwnership,
  isModeratorUser,
  validateToken,
} from "../utils-module/authentication.js";
import { reduceImgQuality } from "../utils-module/images.js";

// Routes

// GET X RECIPES FROM GIVEN DATE WITH FILTERS
router.get("/", async (req, res, next) => {
  try {
    const validatedToken = validateToken(req.cookies?.userToken);

    if (Object.keys(req.query).length > 0) {
      //to be able to delete filters
      if (req.query.filters) {
        req.query.filters = JSON.parse(req.query.filters);
      }

      let publicRecipeQuery =
        !validatedToken ||
        (req.query.ownerOnly === undefined &&
          req.query.favoritesOnly === undefined &&
          req.query.approvedOnly === undefined &&
          req.query.approvalRequiredOnly === undefined)
          ? { private: false }
          : {};

      //only moderators are allowed to use these fields when building a custom query
      if (
        !validatedToken ||
        req.query.customQuery !== "true" ||
        !(await isModeratorUser(validatedToken))
      ) {
        req.query.filters.private = false;
      }

      let ownerOnlyQuery = {};
      if (validatedToken && req.query.ownerOnly === "true") {
        switch (req.query.privacyState) {
          case "all":
            ownerOnlyQuery = { owner: validatedToken._id };
            break;
          case "public":
            ownerOnlyQuery = { owner: validatedToken._id, private: false };
            break;
          case "pending approval":
            ownerOnlyQuery = {
              owner: validatedToken._id,
              approval_required: true,
            };
            break;
          case "approved":
            ownerOnlyQuery = { owner: validatedToken._id, approved: true };
            break;
          case "private":
            ownerOnlyQuery = { owner: validatedToken._id, private: true };
            break;
          default:
            ownerOnlyQuery = { owner: validatedToken._id };
            break;
        }
      }

      let approvalRequiredOnlyQuery =
        validatedToken && req.query.approvalRequiredOnly === "true"
          ? { approval_required: true }
          : {};

      let favoritesOnlyQuery =
        validatedToken && req.query.favoritesOnly === "true"
          ? { favorited_by: validatedToken._id, private: false }
          : {};

      let approvedOnlyQuery =
        req.query.approvedOnly === "true"
          ? { approved: true, private: false }
          : {};

      let textSearchQuery = req.query?.searchText
        ? { title: { $regex: req.query.searchText, $options: "mi" } }
        : {};
      let recipes = await Recipe.find({
        creation_time: { $lt: req.query.latest },
        ...publicRecipeQuery,
        ...ownerOnlyQuery,
        ...approvalRequiredOnlyQuery,
        ...favoritesOnlyQuery,
        ...approvedOnlyQuery,
        ...textSearchQuery,
        ...req.query?.filters,
      })
        .select("-image")
        .populate("owner", "firstname lastname")
        .sort({ creation_time: -1 })
        .limit(parseInt(req.query.count));

      res.sentCount = Object.keys(recipes).length;
      res.status(200).json(recipes);
    } else {
      const recipes = await Recipe.find({ private: false })
        .select("-image")
        .populate("owner", "firstname lastname")
        .sort({
          creation_time: -1,
        });
      res.status(200).json(recipes);
    }
  } catch (err) {
    next(err);
  }
});

// GET BACK A SPECIFIC RECIPE
router.get("/id/:recipe_id", async (req, res, next) => {
  try {
    const validatedToken = validateToken(req.cookies?.userToken);
    const recipe = await Recipe.findById(req.params.recipe_id)
      .select("-image")
      .populate("owner", "firstname lastname");
    if (
      !recipe.private ||
      (validatedToken &&
        (await authenticateRecipeOwnership(validatedToken, {
          owner: recipe.owner._id,
        })))
    ) {
      res.status(200).json(recipe);
    } else {
      res.status(401).send("Missing permissions to view recipe.");
    }
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
    const isModerator = await isModeratorUser(req.headers.validatedToken);
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

    //auto approve a recipe if a moderator edits it
    if (isModerator && !req.body.recipeData.private) {
      req.body.recipeData.approved = true;
      req.body.recipeData.approval_required = false;
    } else if (req.body.recipeData.private) {
      req.body.recipeData.approval_required = false;
      req.body.recipeData.approved = false;
    } else {
      req.body.recipeData.approved = false;
    }

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
        await Recipe.findById(savedRecipe._id)
          .select("-image")
          .populate("owner", "firstname lastname")
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
    const isModerator = await isModeratorUser(req.headers.validatedToken);
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

      //auto approve a recipe if a moderator edits it
      if (isModerator && !req.body.recipeData.private) {
        req.body.recipeData.approved = true;
        req.body.recipeData.approval_required = false;
      } else if (req.body.recipeData.private) {
        req.body.recipeData.approval_required = false;
        req.body.recipeData.approved = false;
      } else {
        req.body.recipeData.approved = false;
      }

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
      const recipe = await Recipe.findById({ _id: req.params.recipe_id })
        .select("-image")
        .populate("owner", "firstname lastname");
      res.status(200).json(recipe);
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
    const recipe = await Recipe.findById({ _id: req.params.recipe_id });
    if (recipe.private) {
      res.status(403).send("Private recipes can not be favorited");
    } else {
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
    }
  } catch (err) {
    next(err);
  }
});

// APPROVE A RECIPE
router.post("/edit/approve/:recipe_id", async (req, res, next) => {
  try {
    const recipe = await Recipe.findById({ _id: req.params.recipe_id });
    if (!recipe.private) {
      const isModerator = await isModeratorUser(req.headers.validatedToken);

      if (isModerator) {
        await Recipe.updateOne(
          { _id: req.params.recipe_id },
          {
            approved: req.body.approve,
            approval_required: false,
            private: false,
          }
        );
        res.status(200).json({ approved: true });
      } else {
        res.status(403).send("Missing privileges to approve recipe.");
      }
    } else {
      res.status(403).send("Cant approve a private recipe.");
    }
  } catch (err) {
    next(err);
  }
});
export default router;
