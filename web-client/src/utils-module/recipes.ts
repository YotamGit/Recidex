import axios from "axios";
//redux
import store from "../store";
import { setAlert } from "../slices/utilitySlice";

// GET A SPECIFIC RECIPE
export async function getRecipe(recipeId: string) {
  try {
    let response = await axios.get(`/api/recipes/id/${recipeId}`);
    return response.data;
  } catch (error: any) {
    store.dispatch(
      setAlert({
        severity: "error",
        title: "Error",
        message: "Failed to fetch recipe, Please refresh the page.",
        details: error.response.data ? error.response.data : undefined,
      })
    );
  }
}

// GET RECIPE TITLES
export async function getRecipeTitles(filters?: object) {
  try {
    let response = await axios.get("/api/recipes/titles", { params: filters });
    return response.data;
  } catch (error: any) {
    store.dispatch(
      setAlert({
        severity: "error",
        title: "Error",
        message: "Failed to Fetch Recipe Titles.",
        details: error.response.data ? error.response.data : undefined,
      })
    );
    return [];
  }
}

//GET RECIPE COUNT
export async function getRecipeCount() {
  try {
    let count = await axios.get("/api/recipes/count");
    return Number(count.data);
  } catch (error: any) {
    store.dispatch(
      setAlert({
        severity: "error",
        title: "Error",
        message: "Failed to get recipes count.",
        details: error.response.data ? error.response.data : undefined,
      })
    );
  }
}
