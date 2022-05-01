import axios from "axios";

// GET A SPECIFIC RECIPE
export async function getRecipe(recipeId:string) {
  try {
    var response = await axios.get(`/api/recipes/id/${recipeId}`);
    return response.data;
  } catch (error:any) {
    window.alert("Failed to Fetch Recipe.\nReason: " + error.message);
  }
}

// GET RECIPE TITLES
export async function getRecipeTitles() {
  try {
    var response = await axios.get("/api/recipes/titles");
    return response.data;
  } catch (error: any) {
    window.alert("Failed to Fetch Recipe Titles\nReason: " + error.message);
    return [];
  }
}
