import axios from "axios";
import {
  createSlice,
  createSelector,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import { setFilters } from "./filtersSlice";

const initialState = {
  recipes: [],
  fetchedAllRecipes: false,
};

export const getRecipes = createAsyncThunk(
  "recipes/getRecipes",
  async (params, thunkAPI) => {
    try {
      var result = await axios.get("/api/recipes", { params: params });

      thunkAPI.dispatch(setFetchedAllRecipes(result.data.length));
      return result.data;
    } catch (error) {
      window.alert("Failed to Fetch Recipes.\nReason: " + error.message);
    }
  }
);

export const filterRecipes = createAsyncThunk(
  "recipes/filterRecipes",
  async (filters, thunkAPI) => {
    console.log(filters);
    //if some of the values isnt undefined
    //if (!Object.values(filters).some((x) => typeof x !== "undefined")) return;
    thunkAPI.dispatch(setFilters(filters));
    try {
      var result = await axios.get("/api/recipes", {
        params: {
          latest: new Date(),
          count: 4,
          filters: filters,
        },
      });
      thunkAPI.dispatch(setFetchedAllRecipes(result.data.length));
      return result.data;
    } catch (error) {
      window.alert("Failed to Filter Recipes.\nReason: " + error.message);
    }
  }
);

const recipesSlice = createSlice({
  name: "recipes",
  initialState,
  reducers: {
    setFetchedAllRecipes(state, action) {
      state.fetchedAllRecipes = action.payload === 0 ? true : false;
    },
    setRecipes(state, action) {
      state.recipes = action.payload;
    },
    searchRecipe(state, action) {
      window.alert("Searching is Not Yet Available");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRecipes.fulfilled, (state, action) => {
        state.recipes = action.payload
          ? [...state.recipes, ...action.payload]
          : state.recipes;
      })
      .addCase(filterRecipes.fulfilled, (state, action) => {
        state.recipes = [...action.payload];
      });
  },
});

export const { setFetchedAllRecipes, setRecipes } = recipesSlice.actions;

export default recipesSlice.reducer;
