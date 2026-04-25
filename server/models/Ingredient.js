import mongoose from "mongoose";

const dimensions = ["count", "mass", "volume"];

const IngredientCategoriesSchema = mongoose.Schema(
  {
    category_id: Number,
    category_name_english: String,
    category_name_hebrew: String,
  },
  { collection: "ingredient-categories" },
);

const IngredientMeasurementUnitsSchema = mongoose.Schema(
  {
    unit_id: Number,
    unit_name_english: String,
    unit_abbreviation_english: String,
    unit_name_hebrew: String,
    unit_abbreviation_hebrew: String,
    dimension: { type: String, enums: dimensions },
    to_base_factor: Number,
  },
  { collection: "ingredient-measurement-units" },
);

const IngredientPrepMethodsSchema = mongoose.Schema(
  {
    prep_id: Number,
    prep_name_english: String,
    prep_name_hebrew: String,
    affects_weight: {
      type: Boolean,
      default: true,
    },
  },
  { collection: "ingredient-prep-methods" },
);

const IngredientDimensionConversionSchema = mongoose.Schema(
  {
    item_id: Number, //ingredient
    from_unit_id: Number,
    to_unit_id: Number,
    prep_id: Number,
    factor: Number,
    source: { type: String, enums: ["AquaCalc"] },
    confidence: { type: String, enums: ["high", "medium", "low"] },
  },
  { collection: "ingredient-dimension-conversion" },
);

const IngredientSchema = mongoose.Schema(
  {
    item_id: Number,
    item_name_english: String,
    item_name_hebrew: String,
    category: Number,
    preferred_shopping_dimension: {
      type: String,
      enums: dimensions,
    },
  },
  { collection: "ingredient" },
);

export const IngredientCategories = mongoose.model(
  "IngredientCategoriesModel",
  IngredientCategoriesSchema,
);
export const IngredientMeasurementUnits = mongoose.model(
  "IngredientMeasurementUnitsModel",
  IngredientMeasurementUnitsSchema,
);
export const IngredientPrepMethods = mongoose.model(
  "IngredientPrepMethodsModel",
  IngredientPrepMethodsSchema,
);
export const IngredientDimensionConversion = mongoose.model(
  "IngredientDimensionConversionModel",
  IngredientDimensionConversionSchema,
);
export const Ingredient = mongoose.model("IngredientModel", IngredientSchema);
