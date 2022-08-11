import express from "express";
import mongoose from "mongoose";
import sanitizeHtml from "sanitize-html";
const router = express.Router();
import { Recipe } from "../models/Recipe.js";
import { User } from "../models/User.js";
import {
  authenticateRecipeOwnership,
  isModeratorUser,
  validateToken,
} from "../utils-module/authentication.js";
import { reduceImgQuality } from "../utils-module/images.js";
import {
  emailUserRecipeApproved,
  emailUserRecipeDisapproved,
} from "../utils-module/notifications.js";
import {
  escapeRegexSpecialChar,
  isValidObjectId,
} from "../utils-module/misc.js";

//for validating enums when updating
const opts = { runValidators: true };

// Routes

// GET X RECIPES FROM GIVEN DATE WITH FILTERS
router.post("/filter", async (req, res, next) => {
  try {
    const validatedToken = validateToken(req.cookies?.userToken);
    if (Object.keys(req.body).length > 0) {
      // query to retrieve public recipes only unless one of the fields exists
      let publicRecipeQuery =
        !validatedToken ||
        (req.body.ownerOnly !== true &&
          req.body.favoritesOnly !== true &&
          req.body.approvedOnly !== true &&
          req.body.approvalRequiredOnly !== true &&
          req.body.customQuery !== true)
          ? { private: false }
          : {};

      // prevent the usage of certain fields in case of publicRecipeQuery bypass
      //o nly moderators are allowed to use these fields when building a custom query
      if (
        !validatedToken ||
        req.body.customQuery !== true ||
        !(await isModeratorUser(validatedToken))
      ) {
        if (req.body?.filters?.private) {
          req.body.filters.private = false;
        }
      }

      // query to retrieve recipes for a specific user with privacy filtering
      let privacyQueryCombinations = {
        all: { owner: mongoose.Types.ObjectId(validatedToken._id) },
        public: {
          owner: mongoose.Types.ObjectId(validatedToken._id),
          private: false,
        },
        "pending approval": {
          owner: mongoose.Types.ObjectId(validatedToken._id),
          approval_required: true,
        },
        approved: {
          owner: mongoose.Types.ObjectId(validatedToken._id),
          approved: true,
        },
        private: {
          owner: mongoose.Types.ObjectId(validatedToken._id),
          private: true,
        },
      };
      let ownerOnlyQuery = {};
      if (validatedToken && req.body.ownerOnly === true) {
        ownerOnlyQuery =
          privacyQueryCombinations[req.body.privacyState] ||
          privacyQueryCombinations["all"];
      }

      // query to retrieve recipes that require approval
      let approvalRequiredOnlyQuery =
        validatedToken && req.query.approvalRequiredOnly === true
          ? { approval_required: true, private: false }
          : {};

      // query to retrieve user-favorited recipes only
      let favoritesOnlyQuery =
        validatedToken && req.body.favoritesOnly === true
          ? {
              favorited_by: mongoose.Types.ObjectId(validatedToken._id),
              private: false,
            }
          : {};

      // query to retrieve only approved recipes
      let approvedOnlyQuery =
        req.body.approvedOnly === true
          ? { approved: true, private: false }
          : {};

      // query to search recipes by partial title text
      let textSearchQuery = req.body?.searchText
        ? {
            title: {
              $regex: escapeRegexSpecialChar(req.body.searchText),
              $options: "mi",
            },
          }
        : {};

      // let sortQuery = {}
      // req.query.sortField
      // req.query.sortDirection

      // pagination variables
      let pageSize =
        Math.abs(req.body.pagination?.pageSize) || Number.MAX_SAFE_INTEGER;
      let pageNumber = Math.abs(req.body.pagination?.pageNumber) || 1;
      let skip = pageSize * (pageNumber - 1);

      let recipes = await Recipe.aggregate([
        {
          $match: {
            ...publicRecipeQuery,
            ...ownerOnlyQuery,
            ...approvalRequiredOnlyQuery,
            ...favoritesOnlyQuery,
            ...approvedOnlyQuery,
            ...textSearchQuery,
            ...req.body?.filters,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "owner",
            foreignField: "_id",
            as: "fullOwner",
          },
        },
        {
          $set: {
            favorite_count: {
              $size: "$favorited_by",
            },
            fullOwner: { $first: "$fullOwner" },
          },
        },
        {
          $set: {
            owner: {
              firstname: "$fullOwner.firstname",
              lastname: "$fullOwner.lastname",
            },
          },
        },
        { $unset: ["image", "fullOwner"] },
        {
          $sort: {
            [req.body.sort?.field || "creation_time"]: parseInt(
              req.body.sort?.direction || "-1"
            ),
          },
        },
      ])
        .skip(skip)
        .limit(pageSize);

      console.log(recipes.length);
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
    if (!isValidObjectId(req.params.recipe_id)) {
      res.status(404).send("Recipe not found.");
      return;
    }

    const validatedToken = validateToken(req.cookies?.userToken);
    const recipe = await Recipe.findById(req.params.recipe_id)
      .select("-image")
      .populate("owner", "firstname lastname");

    if (!recipe) {
      res.status(404).send("Recipe not found.");
      return;
    }

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
    const titles = await Recipe.find({ ...req.query }).distinct("title");
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
    req.body.recipeData.notes = sanitizeHtml(req.body.recipeData.notes);

    //delete certain fields for security reasons(other fields are limited b)
    delete req.body.recipeData._id;
    delete req.body.recipeData.creation_time;
    delete req.body.recipeData.last_update_time;
    delete req.body.recipeData.owner;
    delete req.body.recipeData.favorited_by;

    //handle privacy
    if (!isModerator && !req.body.recipeData.private) {
      req.body.recipeData.approved = false;
    }
    if (req.body.recipeData.private) {
      req.body.recipeData.approval_required = false;
      req.body.recipeData.approved = false;
    }
    if (req.body.recipeData.approval_required) {
      req.body.recipeData.approved = false;
      req.body.recipeData.private = false;
    }

    //reduce image quality if present
    if (req.body.recipeData.image) {
      try {
        req.body.recipeData.image = await reduceImgQuality(
          req.body.recipeData.image
        );
      } catch (err) {
        res.status(400).send("Cannot add recipe. Invalid Image");
        return;
      }
    }

    const savedRecipe = await Recipe.create({
      ...req.body.recipeData,
      owner: req.headers.validatedToken._id,
    });
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
    if (!isValidObjectId(req.params.recipe_id)) {
      res.status(404).send("Recipe not found.");
      return;
    }

    const recipe = await Recipe.findById(req.params.recipe_id);
    if (!recipe) {
      res.status(404).send("Recipe not found.");
      return;
    }

    const isModerator = await isModeratorUser(req.headers.validatedToken);
    const isOwner = authenticateRecipeOwnership(
      req.headers.validatedToken,
      recipe
    );

    if (isOwner || isModerator) {
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
    if (!isValidObjectId(req.params.recipe_id)) {
      res.status(404).send("Recipe not found.");
      return;
    }
    console.log(req.body.recipeData);
    const recipe = await Recipe.findById(req.params.recipe_id);
    if (!recipe) {
      res.status(404).send("Recipe not found.");
      return;
    }

    const isOwner = authenticateRecipeOwnership(
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
      req.body.recipeData.notes = sanitizeHtml(req.body.recipeData.notes);

      //delete certain fields for security reasons(other fields are limited)
      delete req.body.recipeData._id;
      delete req.body.recipeData.creation_time;
      delete req.body.recipeData.last_update_time;
      delete req.body.recipeData.owner;
      delete req.body.recipeData.favorited_by;

      //handle privacy
      const isModerator = await isModeratorUser(req.headers.validatedToken);
      if (!isModerator && !req.body.recipeData.private) {
        req.body.recipeData.approved = false;
      }
      if (req.body.recipeData.private) {
        req.body.recipeData.approval_required = false;
        req.body.recipeData.approved = false;
      }
      if (req.body.recipeData.approval_required) {
        req.body.recipeData.approved = false;
        req.body.recipeData.private = false;
      }

      //reduce image quality if present
      if (req.body.recipeData.image) {
        try {
          req.body.recipeData.image = await reduceImgQuality(
            req.body.recipeData.image
          );
        } catch (err) {
          res.status(400).send("Cannot edit recipe. Invalid Image");
          return;
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
        },
        opts
      );
      const recipe = await Recipe.findById({ _id: req.params.recipe_id })
        .select("-image")
        .populate("owner", "firstname lastname");

      //notify user of recipe approval by a moderator
      if (
        !recipe.private &&
        recipe.approved &&
        req.headers.validatedToken._id != recipe.owner._id
      ) {
        try {
          await emailUserRecipeApproved({
            recipe: recipe,
            recipient: recipe.owner._id,
            moderator: {
              firstname: req.headers.validatedToken.firstname,
              lastname: req.headers.validatedToken.lastname,
            },
            byEdit: true,
          });
        } catch (err) {
          console.log(err);
        }
      }

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
    if (!isValidObjectId(req.params.recipe_id)) {
      res.status(404).send("Recipe not found.");
      return;
    }

    const recipe = await Recipe.findById({ _id: req.params.recipe_id });
    if (!recipe) {
      res.status(404).send("Recipe not found.");
      return;
    } else if (recipe.private) {
      res.status(403).send("Private recipes can not be favorited");
      return;
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
              { favorited_by: users },
              opts
            );
          }
          res.status(200).json(users);
          break;
        case false:
          if (index >= 0) {
            users.splice(index, 1);
            await Recipe.updateOne(
              { _id: req.params.recipe_id },
              { favorited_by: users },
              opts
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
    if (!isValidObjectId(req.params.recipe_id)) {
      res.status(404).send("Recipe not found.");
      return;
    }

    const recipe = await Recipe.findById({ _id: req.params.recipe_id });
    if (!recipe) {
      res.status(404).send("Recipe not found");
      return;
    }

    if (!recipe.private) {
      const isModerator = await isModeratorUser(req.headers.validatedToken);

      if (req.body.approve === undefined) {
        res.status(403).send(`Missing argument "approve".`);
        return;
      }
      if (isModerator) {
        const updatedRecipe = await Recipe.findOneAndUpdate(
          { _id: req.params.recipe_id },
          {
            approved: req.body.approve,
            approval_required: false,
            private: false,
          },
          { new: true, ...opts }
        ).populate("owner", "firstname lastname email");

        //email result to user
        try {
          switch (req.body.approve) {
            case true:
              await emailUserRecipeApproved({
                recipient: updatedRecipe.owner._id,
                recipe: updatedRecipe,
                moderator: {
                  firstname: req.headers.validatedToken.firstname,
                  lastname: req.headers.validatedToken.lastname,
                },
                byEdit: false,
              });
              break;
            case false:
              await emailUserRecipeDisapproved({
                recipient: updatedRecipe.owner._id,
                recipe: updatedRecipe,
                moderator: {
                  firstname: req.headers.validatedToken.firstname,
                  lastname: req.headers.validatedToken.lastname,
                },
                reason: req.body.reason,
              });
              break;
          }
        } catch (err) {
          console.log(err);
        }

        res.status(200).json(updatedRecipe);
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

// REQUEST APPROVAL OF A RECIPE
router.post("/edit/request-approval/:recipe_id", async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.recipe_id)) {
      res.status(404).send("Recipe not found.");
      return;
    }

    const recipe = await Recipe.findById({ _id: req.params.recipe_id });
    if (!recipe) {
      res.status(404).send("Recipe not found");
      return;
    } else if (recipe.private) {
      res.status(403).send("Cant request approval for a private recipe.");
      return;
    } else if (req.body.approval_required === undefined) {
      res.status(403).send(`Missing argument "request_approval".`);
      return;
    }

    const isOwner = authenticateRecipeOwnership(
      req.headers.validatedToken,
      recipe
    );
    if (isOwner) {
      const updatedRecipe = await Recipe.findOneAndUpdate(
        { _id: req.params.recipe_id },
        {
          approved: false,
          approval_required: req.body.approval_required,
          private: false,
        },
        { new: true, ...opts }
      ).populate("owner", "firstname lastname");

      res.status(200).json(updatedRecipe);
    } else {
      res.status(403).send("Missing privileges to request approval.");
    }
  } catch (err) {
    next(err);
  }
});

// CHANGE PRIVACY OF RECIPE
router.post("/edit/change-privacy/:recipe_id", async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.recipe_id)) {
      res.status(404).send("Recipe not found.");
      return;
    }

    const recipe = await Recipe.findById({ _id: req.params.recipe_id });
    if (!recipe) {
      res.status(404).send("Recipe not found");
      return;
    } else if (req.body.private === undefined) {
      res.status(403).send(`Missing argument "private".`);
      return;
    }

    const isOwner = authenticateRecipeOwnership(
      req.headers.validatedToken,
      recipe
    );
    if (isOwner) {
      const updatedRecipe = await Recipe.findOneAndUpdate(
        { _id: req.params.recipe_id },
        {
          private: req.body.private,
          approval_required: false,
          approved: false,
        },
        { new: true, ...opts }
      ).populate("owner", "firstname lastname");

      res.status(200).json(updatedRecipe);
    } else {
      res.status(403).send("Missing privileges to change recipe privacy.");
    }
  } catch (err) {
    next(err);
  }
});

export default router;
