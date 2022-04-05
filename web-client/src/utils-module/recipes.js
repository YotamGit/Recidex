const axios = require("axios");

// GET BACK A SPECIFIC RECIPE
exports.getRecipe = async (recipeId) => {
  try {
    var response = await axios.get(`/api/recipes/${recipeId}`);
    return response.data;
  } catch (error) {
    window.alert("Failed to Fetch Recipe.\nReason: " + error.message);
  }
};
