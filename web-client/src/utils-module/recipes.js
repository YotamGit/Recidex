import axios from "axios";

// GET BACK A SPECIFIC RECIPE
export async function getRecipe(recipeId) {
  try {
    var response = await axios.get(`/api/recipes/${recipeId}`);
    return response.data;
  } catch (error) {
    window.alert("Failed to Fetch Recipe.\nReason: " + error.message);
  }
}
