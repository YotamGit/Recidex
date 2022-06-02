import mongoose from "mongoose";

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
    notes: String,
    rtl: {
      type: Boolean,
      default: false,
    },
    source: String,
    owner: { type: mongoose.Types.ObjectId, ref: "UserModel", required: true },
    imageName: String,
    image: {
      type: Buffer,
      default: undefined,
    },
    favorited_by: [{ type: mongoose.Types.ObjectId, ref: "UserModel" }],
    approval_required: {
      type: Boolean,
      default: false,
    },
    approved: {
      type: Boolean,
      default: false,
    },
    private: {
      type: Boolean,
      default: false,
    },
  },
  { collection: "recipes" }
);

export const Recipe = mongoose.model("RecipeModel", RecipeSchema);
