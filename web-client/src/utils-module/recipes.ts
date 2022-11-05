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

//GET RECIPE KPI DATA
export async function getRecipeKpiData() {
  try {
    let count = await axios.get("/api/recipes/kpi-data");

    return count.data;
  } catch (error: any) {
    store.dispatch(
      setAlert({
        severity: "error",
        title: "Error",
        message: "Failed to get recipes KPI data.",
        details: error.response.data ? error.response.data : undefined,
      })
    );
  }
}
