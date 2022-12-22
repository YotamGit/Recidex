import mongoose from "mongoose";

export const PRIVACY_VALUES = [
  "all",
  "public",
  "approved",
  "pending approval",
  "private",
];

export const SORT_FIELDS = [
  "creation_time",
  "last_update_time",
  "favorite_count",
];

export const RECIPE_VALUES = {
  recipe_categories: {
    Proteins: ["Meat", "Chicken", "Fish", "Other"],
    Salads: [],
    Asian: ["Japanese", "Chinese", "Thai", "Indian", "Other"],
    "Soups and Stews": ["Clear Soup", "Thick Soup", "Stew", "Other"],
    Pasta: [],
    "Pizza and Focaccia": [],
    Bread: ["Salty Pastries", "Other"],
    Drinks: ["Hot", "Cold", "Alcohol", "Other"],
    Desserts: [
      "Cookies",
      "Yeast",
      "Cakes",
      "Tarts and Pies",
      "Cup",
      "Snacks and Candies",
    ],
    Other: [],
  },
  recipe_difficulties: [
    "Very Easy",
    "Easy",
    "Medium",
    "Hard",
    "Very Hard",
    "Gordon Ramsay",
  ],
  recipe_durations: [
    "under 10 minutes",
    "10-20 minutes",
    "20-40 minutes",
    "40-60 minutes",
    "1-2 hours",
    "over 2 hours",
  ],
};
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
    category: {
      type: String,
      enum: [""].concat(Object.keys(RECIPE_VALUES.recipe_categories)),
    },
    sub_category: {
      type: String,
      enum: [""].concat(...Object.values(RECIPE_VALUES.recipe_categories)),
    },
    difficulty: {
      type: String,
      enum: [""].concat(RECIPE_VALUES.recipe_difficulties),
    },
    prep_time: {
      type: String,
      enum: [""].concat(RECIPE_VALUES.recipe_durations),
    },
    total_time: {
      type: String,
      enum: [""].concat(RECIPE_VALUES.recipe_durations),
    },
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
