import axios from "axios";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "../store";

import { setFilters } from "./filtersSlice";

export type TRecipe = {
  _id?: string;
  creation_time?: string;
  last_update_time?: string;
  owner?: {
    firstname: string;
    lastname: string;
  };
  favorited_by?: string[];
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
  image: string | boolean | undefined;
  //string:uploading a new photo, boolean(false):deleting a photo
  //undefined:no changes to photo
};

interface RecipesState {
  recipes: TRecipe[];
  fetchedAllRecipes: boolean;
}
const initialState: RecipesState = {
  recipes: [],
  fetchedAllRecipes: false,
};

interface RecipesSliceError {
  statusCode: number;
  data: string;
  message: string;
}

type AsyncThunkConfig = {
  /** return type for `thunkApi.getState` */
  state?: RootState;
  /** type for `thunkApi.dispatch` */
  dispatch?: AppDispatch;

  /** type to be passed into `rejectWithValue`'s first argument that will end up on `rejectedAction.payload` */
  rejectValue?: RecipesSliceError;
};

// get recipes from the server
interface GetRecipesProps {
  replace: boolean;
  args?: any;
}
// params - {replace:Boolean, args:{filters to pass to the db}}, see implementation...
export const getRecipes = createAsyncThunk<
  { replace: boolean; recipes: any },
  GetRecipesProps,
  AsyncThunkConfig
>("recipes/getRecipes", async (params, thunkAPI) => {
  const state = thunkAPI.getState() as RootState;

  //set additional filters before request
  params.args && thunkAPI.dispatch(setFilters(params.args));

  let userId = state.users.userId;
  let searchText = state.filters.searchText;
  let favoritesOnly = state.filters.favoritesOnly;
  let selecetedfilters = state.filters.selectedFilters;

  let result = await axios.get("/api/recipes", {
    params: {
      latest: params.args?.latest || new Date(),
      count: 12,
      favoritesOnly: favoritesOnly,
      userId: favoritesOnly ? userId : undefined,
      searchText: searchText,
      ...params.args,
      filters: selecetedfilters,
    },
  });

  thunkAPI.dispatch(setFetchedAllRecipes(result.data.length));
  return { replace: params.replace, recipes: result.data };
});

interface EditRecipeProps {
  recipeData: TRecipe;
}
export const editRecipe = createAsyncThunk<
  TRecipe[],
  EditRecipeProps,
  AsyncThunkConfig
>("recipes/editRecipe", async (props, thunkAPI) => {
  const state = thunkAPI.getState() as RootState;
  try {
    let response = await axios.post(
      `/api/recipes/edit/${props.recipeData._id}`,
      {
        recipeData: props.recipeData,
      }
    );
  } catch (error: any) {
    return thunkAPI.rejectWithValue({
      statusCode: error?.response?.status,
      data: error?.response?.data,
      message: error.message,
    });
  }

  return state.recipes.recipes.map((recipe: TRecipe) =>
    recipe._id === props.recipeData._id
      ? { ...recipe, ...props.recipeData }
      : recipe
  );
});

interface DeleteRecipeProps {
  id: string;
}
export const deleteRecipe = createAsyncThunk<
  TRecipe[],
  DeleteRecipeProps,
  AsyncThunkConfig
>("recipes/deleteRecipe", async (props, thunkAPI) => {
  const state = thunkAPI.getState() as RootState;
  try {
    await axios.post(`/api/recipes/delete/${props.id}`);
  } catch (error: any) {
    return thunkAPI.rejectWithValue({
      statusCode: error?.response?.status,
      data: error?.response?.data,
      message: error.message,
    });
  }

  return state.recipes.recipes.filter(
    (recipe: TRecipe) => recipe._id !== props.id
  );
});

interface AddRecipeProps {
  recipeData: TRecipe;
}
export const addRecipe = createAsyncThunk<
  TRecipe,
  AddRecipeProps,
  AsyncThunkConfig
>("recipes/addRecipe", async (props, thunkAPI) => {
  delete props.recipeData?._id; //no id is needed when creating a new recipe
  try {
    let result = await axios.post(`/api/recipes/new`, {
      recipeData: props.recipeData,
    });
    return result.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({
      statusCode: error?.response?.status,
      data: error?.response?.data,
      message: error.message,
    });
  }
});

interface FavoriteRecipeProps {
  id: string;
  favorite: boolean;
}
export const favoriteRecipe = createAsyncThunk<
  TRecipe[],
  FavoriteRecipeProps,
  AsyncThunkConfig
>("recipes/favoriteRecipe", async (props, thunkAPI) => {
  const state = thunkAPI.getState() as RootState;

  try {
    let res = await axios.post(`/api/recipes/edit/favorite/${props.id}`, {
      favorite: props.favorite,
    });
    //TODO return a single recipe instead of all of the recipes
    return state.recipes.recipes.map((recipe: TRecipe) =>
      recipe._id === props.id ? { ...recipe, favorited_by: res.data } : recipe
    );
  } catch (error: any) {
    return thunkAPI.rejectWithValue({
      statusCode: error?.response?.status,
      data: error?.response?.data,
      message: error.message,
    });
  }
});

const recipesSlice = createSlice({
  name: "recipes",
  initialState,
  reducers: {
    setFetchedAllRecipes(state, action: PayloadAction<number>) {
      state.fetchedAllRecipes = action.payload === 0 ? true : false;
    },
    setRecipes(state, action: PayloadAction<TRecipe[]>) {
      state.recipes = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRecipes.fulfilled, (state, action) => {
        if (action.payload.replace) {
          state.recipes = [...action.payload.recipes];
        } else {
          state.recipes = action.payload.recipes
            ? [...state.recipes, ...action.payload.recipes]
            : state.recipes;
        }
      })
      .addCase(getRecipes.rejected, (state, action: PayloadAction<any>) => {
        window.alert(
          "Failed to Fetch Recipes.\nReason: " + action.payload.error.message
        );
      })
      .addCase(editRecipe.fulfilled, (state, action) => {
        state.recipes = action.payload;
      })
      .addCase(editRecipe.rejected, (state, action: PayloadAction<any>) => {
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
      .addCase(addRecipe.rejected, (state, action: PayloadAction<any>) => {
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
      .addCase(deleteRecipe.rejected, (state, action: PayloadAction<any>) => {
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
      .addCase(favoriteRecipe.rejected, (state, action: PayloadAction<any>) => {
        window.alert(
          "Failed to Favorite Recipe, Please Try Again.\nReason: " +
            action.payload.message
        );
      });
  },
});

export const { setFetchedAllRecipes, setRecipes } = recipesSlice.actions;

export default recipesSlice.reducer;
