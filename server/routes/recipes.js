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
      //only moderators are allowed to use these fields when building a custom query
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
      let ownerOnlyQuery = {};
      if (validatedToken && req.body.ownerOnly === true) {
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
        ownerOnlyQuery =
          privacyQueryCombinations[req.body.privacyState] ||
          privacyQueryCombinations["all"];
      }

      // query to retrieve recipes that require approval
      let approvalRequiredOnlyQuery =
        validatedToken && req.body.approvalRequiredOnly === true
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

      // handle special filter fields that may contain ObjectId as string
      if (req.body?.filters?.owner) {
        req.body.filters.owner = mongoose.Types.ObjectId(
          req.body.filters.owner
        );
      }
      if (req.body?.filters?.favorited_by) {
        req.body.filters.favorited_by = mongoose.Types.ObjectId(
          req.body.filters.favorited_by
        );
      }

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
              _id: "$fullOwner._id",
              firstname: "$fullOwner.firstname",
              lastname: "$fullOwner.lastname",
            },
          },
        },
        { $unset: ["image", "fullOwner"] },
        {
          $sort: {
            [req.body.sort?.field || "creation_time"]:
              req.body.sort?.direction === "ascending" ? 1 : -1,
            _id: 1,
          },
        },
      ])
        .skip(skip)
        .limit(pageSize);

      req.logger.info("Sending recipes with the appropriate filters applied", {
        filters: {
          ...publicRecipeQuery,
          ...ownerOnlyQuery,
          ...approvalRequiredOnlyQuery,
          ...favoritesOnlyQuery,
          ...approvedOnlyQuery,
          ...textSearchQuery,
          ...req.body?.filters,
        },
        recipes_sent: Object.keys(recipes).length,
      });
      res.sentCount = Object.keys(recipes).length;
      res.status(200).json(recipes);
    } else {
      const recipes = await Recipe.find({ private: false })
        .select("-image")
        .populate("owner", "firstname lastname")
        .sort({
          creation_time: -1,
        });

      req.logger.info("Sending all of the non private recipes", {
        recipes_sent: Object.keys(recipes).length,
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
      req.logger.info("Unable to retrieve recipe, recipe id is invalid", {
        recipe_id: req.params.recipe_id,
      });
      res.status(404).send("Recipe not found.");
      return;
    }

    const recipe = await Recipe.findById(req.params.recipe_id)
      .select("-image")
      .populate("owner", "firstname lastname");

    if (!recipe) {
      req.logger.info(
        "Failed to retrieve recipe, recipe does not exist in the DB",
        {
          recipe_id: req.params.recipe_id,
        }
      );
      res.status(404).send("Recipe not found.");
      return;
    }

    const validatedToken = validateToken(req.cookies?.userToken);

    if (
      !recipe.private ||
      (validatedToken &&
        (await authenticateRecipeOwnership(validatedToken, {
          owner: recipe.owner._id,
        })))
    ) {
      req.logger.info("Sending recipe", {
        recipe_id: req.params.recipe_id,
      });
      res.status(200).json(recipe);
    } else {
      req.logger.info("Failed to retrieve recipe, missing privileges", {
        recipe_id: req.params.recipe_id,
      });
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
      "imageName",
      "image",
      "-_id",
    ]);

    req.logger.info("Sending recipe image", {
      recipe_id: req.params.recipe_id,
      image_name: recipe.imageName,
    });
    res
      .status(200)
      .set({ "Content-Type": "image/webp" })
      .send(new Buffer.from(recipe.image));
  } catch (err) {
    req.logger.info("Failed to retrieve recipe image", {
      recipe_id: req.params.recipe_id,
    });
    res.status(204).send("No Image Found");
  }
});

// GET ALL RECIPE TITLES
router.get("/titles", async (req, res, next) => {
  try {
    const titles = await Recipe.find({ ...req.query }).distinct("title");
    req.logger.info("Sending recipe titles", { filters: req.query });
    res.status(200).send(titles);
  } catch (err) {
    next(err);
  }
});

// GET RECIPE KPI DATA FOR ADMIN PANEL KPI
router.get("/kpi-data", async (req, res, next) => {
  try {
    const total_recipes_count = (await Recipe.find({}).distinct("_id")).length;

    const private_recipes_count = (
      await Recipe.find({ private: true }).distinct("_id")
    ).length;

    const public_recipes_count = (
      await Recipe.find({
        private: false,
        approval_required: false,
        approved: false,
      }).distinct("_id")
    ).length;

    const approval_required_recipes_count = (
      await Recipe.find({
        private: false,
        approval_required: true,
        approved: false,
      }).distinct("_id")
    ).length;

    const approved_recipes_count = (
      await Recipe.find({
        private: false,
        approval_required: false,
        approved: true,
      }).distinct("_id")
    ).length;

    req.logger.info("Sending recipes kpi data");
    res.status(200).json({
      total_recipes_count,
      private_recipes_count,
      public_recipes_count,
      approval_required_recipes_count,
      approved_recipes_count,
    });
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

    req.logger.info("Sanitized new recipe html");

    //delete certain fields for security reasons(other fields are limited b)
    delete req.body.recipeData._id;
    delete req.body.recipeData.creation_time;
    delete req.body.recipeData.last_update_time;
    delete req.body.recipeData.owner;
    delete req.body.recipeData.favorited_by;
    req.logger.info(
      "Deleted fields that should not be edited by the user from the new recipe data"
    );

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
        req.logger.info("Reduced image quality", {
          image_name: req.body.recipeData.imageName,
        });
      } catch (err) {
        req.logger.info("Failed to add new recipe, invalid image", {
          image_name: req.body.recipeData.imageName,
        });
        res.status(400).send("Cannot add recipe. Invalid Image");
        return;
      }
    }

    const savedRecipe = await Recipe.create({
      ...req.body.recipeData,
      owner: req.headers.validatedToken._id,
    });
    req.logger.info("Added new recipe to the DB", {
      recipe_id: savedRecipe._id,
    });

    req.logger.info("Sending new recipe", {
      recipe_id: savedRecipe._id,
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
      req.logger.info("Failed to delete recipe, invalid recipe id", {
        recipe_id: req.params.recipe_id,
        initiator_id: req.headers.validatedToken._id,
      });
      res.status(404).send("Recipe not found.");
      return;
    }

    const recipe = await Recipe.findById(req.params.recipe_id);
    if (!recipe) {
      req.logger.info(
        "Failed to delete recipe, recipe does not exist in the DB",
        {
          recipe_id: req.params.recipe_id,
          initiator_id: req.headers.validatedToken._id,
        }
      );
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
      req.logger.info("Successfully deleted recipe", {
        recipe_id: req.params.recipe_id,
        initiator_id: req.headers.validatedToken._id,
      });
      res.status(200).json(response);
    } else {
      req.logger.info("Failed to delete recipe, missing privileges", {
        recipe_id: req.params.recipe_id,
        initiator_id: req.headers.validatedToken._id,
      });
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
      req.logger.info("Failed to edit recipe, recipe id is invalid", {
        recipe_id: req.params.recipe_id,
        initiator_id: req.headers.validatedToken._id,
      });
      res.status(404).send("Recipe not found.");
      return;
    }
    const recipe = await Recipe.findById(req.params.recipe_id);
    if (!recipe) {
      req.logger.info(
        "Failed to edit recipe, recipe does not exist in the DB",
        {
          recipe_id: req.params.recipe_id,
          initiator_id: req.headers.validatedToken._id,
        }
      );
      res.status(404).send("Recipe not found.");
      return;
    }

    const isOwner = authenticateRecipeOwnership(
      req.headers.validatedToken,
      recipe
    );
    const isModerator = await isModeratorUser(req.headers.validatedToken);

    if (isOwner || isModerator) {
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

      req.logger.info("Sanitized updated recipe html");

      // to prevent race condition of edit
      const last_update_time = req.body.recipeData.last_update_time;

      //delete certain fields for security reasons(other fields are limited)
      delete req.body.recipeData._id;
      delete req.body.recipeData.creation_time;
      delete req.body.recipeData.last_update_time;
      delete req.body.recipeData.owner;
      delete req.body.recipeData.favorited_by;
      req.logger.info(
        "Deleted fields that should not be edited by the user from the updated recipe data"
      );

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
          req.logger.info("Reduced image quality", {
            image_name: req.body.recipeData.imageName,
          });
        } catch (err) {
          req.logger.info("Failed to edit recipe, invalid image", {
            image_name: req.body.recipeData.imageName,
          });
          res.status(400).send("Cannot edit recipe. Invalid Image");
          return;
        }
      } else if (req.body.recipeData.image === false) {
        //false means the image is to be deleted
        req.body.recipeData.image = null;
      }

      const response = await Recipe.updateOne(
        {
          _id: req.params.recipe_id,
          last_update_time: last_update_time,
        },
        {
          $set: {
            ...req.body.recipeData,
            last_update_time: Date.now(),
          },
        },
        opts
      );

      if (response.modifiedCount === 0) {
        req.logger.info("Failed to edit recipe, encountered a race condition", {
          recipe_id: req.params.recipe_id,
          initiator_id: req.headers.validatedToken._id,
        });
        res
          .status(403)
          .send(
            "Cannot edit recipe. You have edited an older version of the recipe."
          );
        return;
      }

      const recipe = await Recipe.findById({ _id: req.params.recipe_id })
        .select("-image")
        .populate("owner", "firstname lastname");

      req.logger.info("Successfully edited recipe", {
        recipe_id: recipe._id,
        initiator_id: req.headers.validatedToken._id,
      });
      //notify user of recipe approval by a moderator
      if (
        !recipe.private &&
        recipe.approved &&
        req.headers.validatedToken._id != recipe.owner._id
      ) {
        try {
          req.logger.info(
            "Sending email notification about recipe edit to the owner",
            {
              recipe_id: recipe._id,
              user_id: recipe.owner._id,
            }
          );
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

      req.logger.info("Sending updated recipe", {
        recipe_id: recipe._id,
      });
      res.status(200).json(recipe);
    } else {
      req.logger.info("Failed to edit recipe, missing privileges", {
        recipe_id: req.params.recipe_id,
        initiator_id: req.headers.validatedToken._id,
      });
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
      req.logger.info(
        "Failed to update recipe favorite status, recipe id is invalid",
        {
          recipe_id: req.params.recipe_id,
          initiator_id: req.headers.validatedToken._id,
        }
      );
      res.status(404).send("Recipe not found.");
      return;
    }

    const recipe = await Recipe.findById({ _id: req.params.recipe_id });
    if (!recipe) {
      req.logger.info(
        "Failed to update recipe favorite status, does not exist in the DB",
        {
          recipe_id: req.params.recipe_id,
          initiator_id: req.headers.validatedToken._id,
        }
      );
      res.status(404).send("Recipe not found.");
      return;
    } else if (recipe.private) {
      req.logger.info(
        "Failed to update recipe favorite status, can not update favorite status of a private recipe",
        {
          recipe_id: req.params.recipe_id,
          initiator_id: req.headers.validatedToken._id,
        }
      );
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
          req.logger.info("User favorited a recipe", {
            recipe_id: req.params.recipe_id,
            initiator_id: req.headers.validatedToken._id,
          });
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
          req.logger.info("User unfavorited a recipe", {
            recipe_id: req.params.recipe_id,
            initiator_id: req.headers.validatedToken._id,
          });

          req.logger.info("Sending updated recipe favorited by users list", {
            recipe_id: req.params.recipe_id,
          });
          res.status(200).json(users);
          break;
        default:
          req.logger.info(
            `Failed to update recipe favorite status, argument "favorite" is missing from the request or is invalid`,
            {
              recipe_id: req.params.recipe_id,
              initiator_id: req.headers.validatedToken._id,
            }
          );
          res.status(400).send(`Argument "favorite" is missing or not boolean`);
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
      req.logger.info(
        "Failed to update recipe approval status, recipe id is invalid",
        {
          recipe_id: req.params.recipe_id,
          initiator_id: req.headers.validatedToken._id,
        }
      );
      res.status(404).send("Recipe not found.");
      return;
    }

    const recipe = await Recipe.findById({ _id: req.params.recipe_id });
    if (!recipe) {
      req.logger.info(
        "Failed to update recipe approval status, recipe does not exist in the DB",
        {
          recipe_id: req.params.recipe_id,
          initiator_id: req.headers.validatedToken._id,
        }
      );
      res.status(404).send("Recipe not found");
      return;
    }

    if (!recipe.private) {
      const isModerator = await isModeratorUser(req.headers.validatedToken);

      if (req.body.approve === undefined) {
        req.logger.info(
          `Failed to update recipe approval status, argument "approve" is missing from the request`,
          {
            recipe_id: req.params.recipe_id,
            initiator_id: req.headers.validatedToken._id,
          }
        );
        res.status(403).send(`Missing argument "approve".`);
        return;
      }
      if (isModerator) {
        const updatedRecipe = await Recipe.findOneAndUpdate(
          {
            _id: req.params.recipe_id,
            last_update_time: req.body.last_update_time,
          },
          {
            approved: req.body.approve,
            approval_required: false,
            private: false,
            last_update_time: Date.now(),
          },
          { new: true, ...opts }
        ).populate("owner", "firstname lastname email");

        if (!updatedRecipe) {
          req.logger.info(
            "Failed to update recipe approval status, encountered a race condition",
            {
              recipe_id: req.params.recipe_id,
              initiator_id: req.headers.validatedToken._id,
            }
          );
          res.status(403).send(
            `Cannot ${
              req.body.approve ? "approve" : "disapprove"
            } recipe. Recipe has already been 
               approved/disapproved`
          );
          return;
        }
        req.logger.info("Successfully updated recipe approval status", {
          recipe_id: req.params.recipe_id,
          initiator_id: req.headers.validatedToken._id,
        });
        //email result to user
        try {
          switch (req.body.approve) {
            case true:
              req.logger.info("Sending recipe approval email to owner", {
                recipe_id: req.params.recipe_id,
              });
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
              req.logger.info("Sending recipe disapproval email to owner", {
                recipe_id: req.params.recipe_id,
              });
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
          req.logger.error("Failed to send approval/disapproval email", err);
        }
        req.logger.info("Sending updated recipe", {
          recipe_id: req.params.recipe_id,
        });
        res.status(200).json(updatedRecipe);
      } else {
        req.logger.info(
          "Failed to update recipe approval status, missing privileges",
          {
            recipe_id: req.params.recipe_id,
            initiator_id: req.headers.validatedToken._id,
          }
        );
        res.status(403).send("Missing privileges to approve recipe.");
      }
    } else {
      req.logger.info(
        "Failed to update recipe approval status, can not update approval status of a private recipe",
        {
          recipe_id: req.params.recipe_id,
          initiator_id: req.headers.validatedToken._id,
        }
      );
      res.status(403).send("Can't approve/disapprove a private recipe.");
    }
  } catch (err) {
    next(err);
  }
});

// REQUEST APPROVAL OF A RECIPE
router.post("/edit/request-approval/:recipe_id", async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.recipe_id)) {
      req.logger.info(
        "Failed to request approval of recipe, recipe id is invalid",
        {
          recipe_id: req.params.recipe_id,
          initiator_id: req.headers.validatedToken._id,
        }
      );
      res.status(404).send("Recipe not found.");
      return;
    }

    const recipe = await Recipe.findById({ _id: req.params.recipe_id });
    if (!recipe) {
      req.logger.info(
        "Failed to request approval of recipe, recipe does not exist in the DB",
        {
          recipe_id: req.params.recipe_id,
          initiator_id: req.headers.validatedToken._id,
        }
      );
      res.status(404).send("Recipe not found");
      return;
    } else if (recipe.private) {
      req.logger.info(
        "Failed to request approval of recipe, can not request approval of a private recipe",
        {
          recipe_id: req.params.recipe_id,
          initiator_id: req.headers.validatedToken._id,
        }
      );
      res.status(403).send("Cant request approval for a private recipe.");
      return;
    } else if (req.body.approval_required === undefined) {
      req.logger.info(
        `Failed to request approval of recipe, argument "request_approval" is missing from the request`,
        {
          recipe_id: req.params.recipe_id,
          initiator_id: req.headers.validatedToken._id,
        }
      );
      res.status(403).send(`Missing argument "request_approval".`);
      return;
    }

    const isOwner = authenticateRecipeOwnership(
      req.headers.validatedToken,
      recipe
    );
    if (isOwner) {
      const updatedRecipe = await Recipe.findOneAndUpdate(
        {
          _id: req.params.recipe_id,
          approval_required: !req.body.approval_required,
        },
        {
          approved: false,
          approval_required: req.body.approval_required,
          private: false,
          last_update_time: Date.now(),
        },
        { new: true, ...opts }
      ).populate("owner", "firstname lastname");

      if (!updatedRecipe) {
        req.logger.info(
          "Failed to request approval of recipe, encountered a race condition",
          {
            recipe_id: req.params.recipe_id,
            initiator_id: req.headers.validatedToken._id,
          }
        );
        res.status(403).send(
          `Cannot ${
            req.body.approval_required
              ? "request approval"
              : "cancel approval request"
          }. A request has already been 
             requested/canceled`
        );
        return;
      }
      req.logger.info("Successfully requested approval of recipe", {
        recipe_id: req.params.recipe_id,
        initiator_id: req.headers.validatedToken._id,
      });

      req.logger.info("Sending updated recipe", {
        recipe_id: req.params.recipe_id,
      });
      res.status(200).json(updatedRecipe);
    } else {
      req.logger.info(
        "Failed to request approval of recipe, missing privileges",
        {
          recipe_id: req.params.recipe_id,
          initiator_id: req.headers.validatedToken._id,
        }
      );
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
      req.logger.info(
        "Failed to update privacy of recipe, recipe id is invalid",
        {
          recipe_id: req.params.recipe_id,
          initiator_id: req.headers.validatedToken._id,
        }
      );
      res.status(404).send("Recipe not found.");
      return;
    }

    const recipe = await Recipe.findById({ _id: req.params.recipe_id });
    if (!recipe) {
      req.logger.info(
        "Failed to update privacy of recipe, recipe does not exist in the DB",
        {
          recipe_id: req.params.recipe_id,
          initiator_id: req.headers.validatedToken._id,
        }
      );
      res.status(404).send("Recipe not found");
      return;
    } else if (req.body.private === undefined) {
      req.logger.info(
        `Failed to update privacy of recipe, argument "private" is missing from the request`,
        {
          recipe_id: req.params.recipe_id,
          initiator_id: req.headers.validatedToken._id,
        }
      );
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
          last_update_time: Date.now(),
        },
        { new: true, ...opts }
      ).populate("owner", "firstname lastname");

      req.logger.info("Successfully updated recipe privacy", {
        recipe_id: req.params.recipe_id,
        initiator_id: req.headers.validatedToken._id,
      });

      req.logger.info("Sending updated recipe", {
        recipe_id: req.params.recipe_id,
      });
      res.status(200).json(updatedRecipe);
    } else {
      req.logger.info(
        "Failed to update privacy of recipe, missing privileges",
        {
          recipe_id: req.params.recipe_id,
          initiator_id: req.headers.validatedToken._id,
        }
      );
      res.status(403).send("Missing privileges to change recipe privacy.");
    }
  } catch (err) {
    next(err);
  }
});

export default router;
