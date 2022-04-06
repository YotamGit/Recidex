import axios from "axios";
import {
  createSlice,
  createSelector,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import { setFilters, setSearchText } from "./filtersSlice";

const initialState = {
  recipes: [],
  fetchedAllRecipes: false,
};

// get recipes from the server
// params - {replace:Boolean, args:{filters to pass to the db}}, see implementation...
export const getRecipes = createAsyncThunk(
  "recipes/getRecipes",
  async (params, thunkAPI) => {
    //if some of the values arent undefined
    //if (!Object.values(filters).some((x) => typeof x !== "undefined")) return;
    params.args &&
      params.args?.filters &&
      thunkAPI.dispatch(setFilters(params.args.filters));

    var { searchText, favoritesOnly } = thunkAPI.getState().filters;
    var selecetedfilters = thunkAPI.getState().filters.selectedFilters;

    var result = await axios.get("/api/recipes", {
      params: {
        latest: params.args.latest || new Date(),
        count: 4,
        ...params.args,
        userId: params.args?.userId,
        filters: selecetedfilters,
        searchText: searchText,
        favoritesOnly: favoritesOnly,
      },
    });
    thunkAPI.dispatch(setFetchedAllRecipes(result.data.length));
    return { replace: params.replace, data: result.data };
  }
);

export const editRecipe = createAsyncThunk(
  "recipes/editRecipe",
  async (recipeData, thunkAPI) => {
    try {
      let response = await axios.post(`/api/recipes/edit/${recipeData._id}`, {
        headers: {
          Authentication: localStorage.getItem("userToken"),
        },
        recipeData,
      });
    } catch (error) {
      return thunkAPI.rejectWithValue({
        statusCode: error.response.status,
        data: error.response.data,
        message: error.message,
      });
    }

    return thunkAPI
      .getState()
      .recipes.recipes.map((recipe) =>
        recipe._id === recipeData._id ? { ...recipe, ...recipeData } : recipe
      );
  }
);

export const deleteRecipe = createAsyncThunk(
  "recipes/deleteRecipe",
  async (id, thunkAPI) => {
    try {
      await axios.post(`/api/recipes/delete/${id}`, {
        headers: {
          Authentication: localStorage.getItem("userToken"),
        },
      });
    } catch (error) {
      return thunkAPI.rejectWithValue({
        statusCode: error.response.status,
        data: error.response.data,
        message: error.message,
      });
    }

    return thunkAPI
      .getState()
      .recipes.recipes.filter((recipe) => recipe._id !== id);
  }
);

export const addRecipe = createAsyncThunk(
  "recipes/addRecipe",
  async (recipe, thunkAPI) => {
    delete recipe._id;
    try {
      var result = await axios.post(`/api/recipes/new`, {
        headers: {
          Authentication: localStorage.getItem("userToken"),
        },
        recipe,
      });
      return result.data;
    } catch (error) {
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
  async (params, thunkAPI) => {
    try {
      var res = await axios.post(
        `/api/recipes/edit/favorite/${params.recipeId}`,
        {
          headers: {
            Authentication: localStorage.getItem("userToken"),
          },
          favorite: params.favorite,
        }
      );
      return thunkAPI
        .getState()
        .recipes.recipes.map((recipe) =>
          recipe._id === params.recipeId
            ? { ...recipe, favorited_by: res.data }
            : recipe
        );
    } catch (error) {
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
    setFetchedAllRecipes(state, action) {
      state.fetchedAllRecipes = action.payload === 0 ? true : false;
    },
    setRecipes(state, action) {
      state.recipes = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRecipes.fulfilled, (state, action) => {
        if (action.payload.replace) {
          state.recipes = [...action.payload.data];
        } else {
          state.recipes = action.payload.data
            ? [...state.recipes, ...action.payload.data]
            : state.recipes;
        }
      })
      .addCase(getRecipes.rejected, (state, action) => {
        window.alert(
          "Failed to Fetch Recipes.\nReason: " + action.error.message
        );
      })
      .addCase(editRecipe.fulfilled, (state, action) => {
        state.recipes = action.payload;
      })
      .addCase(editRecipe.rejected, (state, action) => {
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
      .addCase(addRecipe.fulfilled, (state, action) => {
        state.recipes = [action.payload, ...state.recipes];
      })
      .addCase(addRecipe.rejected, (state, action) => {
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
      .addCase(deleteRecipe.fulfilled, (state, action) => {
        state.recipes = action.payload;
      })
      .addCase(deleteRecipe.rejected, (state, action) => {
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
      .addCase(favoriteRecipe.fulfilled, (state, action) => {
        state.recipes = action.payload;
      })
      .addCase(favoriteRecipe.rejected, (state, action) => {
        window.alert(
          "Failed to Favorite Recipe, Please Try Again.\nReason: " +
            action.payload.message
        );
      });
  },
});

export const { setFetchedAllRecipes, setRecipes } = recipesSlice.actions;

export default recipesSlice.reducer;
