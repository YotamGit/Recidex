const mongoose = require("mongoose");

const RecipeSchema = mongoose.Schema({
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
  difficulty: String,
  duration: String,
  description: String,
  ingredients: String,
  directions: String,
  rtl: {
    type: Boolean,
    default: false,
  },
  source: String,
  imageName: String,
  image: String,
});

module.exports = mongoose.model("recipes", RecipeSchema);