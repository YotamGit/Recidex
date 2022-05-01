import axios from "axios";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

import { setFilters } from "./filtersSlice";

export type Recipe = {
  _id?: string;
  title: string;
  category: string;
  sub_category: string;
  difficulty: string;
  prep_time: string;
  total_time: string;
  servings: string;
  description: string;
  ingredients: string;
  directions: string;
  rtl: boolean;
  source: string;
  imageName: string;
  image: string;
};

interface RecipesState {
  recipes: Recipe[];
  fetchedAllRecipes: boolean;
}
const initialState: RecipesState = {
  recipes: [],
  fetchedAllRecipes: false,
};

// get recipes from the server
// params - {replace:Boolean, args:{filters to pass to the db}}, see implementation...
export const getRecipes = createAsyncThunk(
  "recipes/getRecipes",
  async (params: any, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    //if some of the values arent undefined
    //if (!Object.values(filters).some((x) => typeof x !== "undefined")) return;
    params.args &&
      params.args?.filters &&
      thunkAPI.dispatch(setFilters(params.args.filters));

    let userId = state.users.userId;
    let searchText = state.filters.searchText;
    let favoritesOnly = state.filters.favoritesOnly;
    let selecetedfilters = state.filters.selectedFilters;

    let result = await axios.get("/api/recipes", {
      params: {
        latest: params.args?.latest || new Date(),
        count: 4,
        favoritesOnly: favoritesOnly,
        userId: favoritesOnly ? userId : undefined,
        searchText: searchText,
        ...params.args,
        filters: selecetedfilters,
      },
    });
    thunkAPI.dispatch(setFetchedAllRecipes(result.data.length));
    return { replace: params.replace, recipes: result.data };
  }
);

export const editRecipe = createAsyncThunk(
  "recipes/editRecipe",
  async (recipeData: Recipe, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    try {
      let response = await axios.post(`/api/recipes/edit/${recipeData._id}`, {
        recipeData,
      });
    } catch (error: any) {
      return thunkAPI.rejectWithValue({
        statusCode: error.response.status,
        data: error.response.data,
        message: error.message,
      });
    }

    return state.recipes.recipes.map((recipe: Recipe) =>
      recipe._id === recipeData._id ? { ...recipe, ...recipeData } : recipe
    );
  }
);

export const deleteRecipe = createAsyncThunk(
  "recipes/deleteRecipe",
  async (id: string, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    try {
      await axios.post(`/api/recipes/delete/${id}`);
    } catch (error: any) {
      return thunkAPI.rejectWithValue({
        statusCode: error.response.status,
        data: error.response.data,
        message: error.message,
      });
    }

    return state.recipes.recipes.filter((recipe: Recipe) => recipe._id !== id);
  }
);

export const addRecipe = createAsyncThunk(
  "recipes/addRecipe",
  async (recipeData: Recipe, thunkAPI) => {
    delete recipeData._id; //no id is needed when creating a new recipe
    try {
      var result = await axios.post(`/api/recipes/new`, {
        recipeData,
      });
      return result.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({
        statusCode: error.response.status,
        data: error.response.data,
        message: error.message,
      });
    }
  }
);

export const favoriteRecipe = createAsyncThunk(
  "recipes/favoriteRecipe",
  async (
    { recipeId, favorite }: { recipeId: string; favorite: boolean },
    thunkAPI
  ) => {
    const state = thunkAPI.getState() as RootState;

    try {
      var res = await axios.post(`/api/recipes/edit/favorite/${recipeId}`, {
        favorite: favorite,
      });
      return state.recipes.recipes.map((recipe:Recipe) =>
        recipe._id === recipeId
          ? { ...recipe, favorited_by: res.data }
          : recipe
      );
    } catch (error: any) {
      return thunkAPI.rejectWithValue({
        statusCode: error.response.status,
        data: error.response.data,
        message: error.message,
      });
    }
  }
);

const recipesSlice = createSlice({
  name: "recipes",
  initialState,
  reducers: {
    setFetchedAllRecipes(state, action:PayloadAction<number>) {
      state.fetchedAllRecipes = action.payload === 0 ? true : false;
    },
    setRecipes(state, action:PayloadAction<Recipe[]>) {
      state.recipes = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRecipes.fulfilled, (state, action:PayloadAction<{replace:boolean, recipes:Recipe[]}>) => {
        if (action.payload.replace) {
          state.recipes = [...action.payload.recipes];
        } else {
          state.recipes = action.payload.recipes
            ? [...state.recipes, ...action.payload.recipes]
            : state.recipes;
        }
      })
      .addCase(getRecipes.rejected, (state, action:PayloadAction<any>) => {
        window.alert(
          "Failed to Fetch Recipes.\nReason: " + action.payload.error.message
        );
      })
      .addCase(editRecipe.fulfilled, (state, action:PayloadAction<Recipe[]>) => {
        state.recipes = action.payload;
      })
      .addCase(editRecipe.rejected, (state, action:PayloadAction<any>) => {
        if (action.payload.statusCode === 401) {
          window.alert(
            "Failed to Edit Recipe in Database.\nReason: " + action.payload.data
          );
        } else {
          window.alert(
            "Failed to Edit Recipe in Database, Please Try Again.\nReason: " +
              action.payload.message
          );
        }
      })
      .addCase(addRecipe.fulfilled, (state, action:PayloadAction<Recipe>) => {
        state.recipes = [action.payload, ...state.recipes];
      })
      .addCase(addRecipe.rejected, (state, action:PayloadAction<any>) => {
        if (action.payload.statusCode === 401) {
          window.alert(
            "Failed to Add Recipe to Database, Please Try Again.\nReason: " +
              action.payload.data
          );
        } else {
          window.alert(
            "Failed to Add Recipe to Database, Please Try Again.\nReason: " +
              action.payload.message
          );
        }
      })
      .addCase(deleteRecipe.fulfilled, (state, action:PayloadAction<Recipe[]>) => {
        state.recipes = action.payload;
      })
      .addCase(deleteRecipe.rejected, (state, action:PayloadAction<any>) => {
        if (action.payload.statusCode === 401) {
          window.alert(
            "Failed to Delete Recipe from Database.\nReason: " +
              action.payload.data
          );
        } else {
          window.alert(
            "Failed to Delete Recipe from Database, Please Try Again.\nReason: " +
              action.payload.message
          );
        }
      })
      .addCase(favoriteRecipe.fulfilled, (state, action:PayloadAction<Recipe[]>) => {
        state.recipes = action.payload;
      })
      .addCase(favoriteRecipe.rejected, (state, action:PayloadAction<any>) => {
        window.alert(
          "Failed to Favorite Recipe, Please Try Again.\nReason: " +
            action.payload.message
        );
      });
  },
});

export const { setFetchedAllRecipes, setRecipes } = recipesSlice.actions;

export default recipesSlice.reducer;
