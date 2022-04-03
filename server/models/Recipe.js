const mongoose = require("mongoose");

const RecipeSchema = mongoose.Schema(
  {
    creation_time: {
      type: Date,
      default: Date.now,
    },
    last_update_time: {
      type: Date,
      default: Date.now,
    },
    title: String,
    category: String,
    sub_category: String,
    difficulty: String,
    prep_time: String,
    total_time: String,
    servings: String,
    description: String,
    ingredients: String,
    directions: String,
    rtl: {
      type: Boolean,
      default: false,
    },
    source: String,
    owner: { type: mongoose.Types.ObjectId, ref: "UserModel", required: true },
    imageName: String,
    image: String,
    user_favorites: [{ type: mongoose.Types.ObjectId, ref: "UserModel" }],
  },
  { collection: "recipes" }
);

module.exports = mongoose.model("RecipeModel", RecipeSchema);
