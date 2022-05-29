import axios from "axios";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "../store";
import { setAlert } from "./utilitySlice";

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

export type TRecipe = {
  _id?: string;
  private: boolean;
  approved?: boolean;
  approval_required: boolean;
  creation_time?: string;
  last_update_time?: string;
  owner?: {
    firstname: string;
    lastname: string;
    _id: string;
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

// get recipes from the server
interface GetRecipesProps {
  replace: boolean;
  args?: any;
}
// params - {replace:Boolean, args:{filters to pass to the db}}, see implementation...
export const getRecipes = createAsyncThunk<
  { replace: boolean; recipes: TRecipe[] },
  GetRecipesProps,
  AsyncThunkConfig
>("recipes/getRecipes", async (params, thunkAPI) => {
  const state = thunkAPI.getState() as RootState;

  let searchText = state.filters.searchText;
  let ownerOnly = state.filters.ownerOnly;
  let privacyState = state.filters.privacyState;
  let favoritesOnly = state.filters.favoritesOnly;
  let approvedOnly = state.filters.approvedOnly;
  let approvalRequiredOnly = state.filters.approvalRequiredOnly;
  let selectedFilters = state.filters.selectedFilters;

  try {
    let result = await axios.get("/api/recipes", {
      params: {
        latest: params.args?.latest || new Date(),
        count: 12,
        ownerOnly: ownerOnly || undefined,
        privacyState: ownerOnly ? privacyState : undefined,
        favoritesOnly: favoritesOnly || undefined,
        approvedOnly: approvedOnly || undefined,
        approvalRequiredOnly: approvalRequiredOnly || undefined,
        searchText: searchText,
        filters: selectedFilters,
      },
    });

    thunkAPI.dispatch(setFetchedAllRecipes(result.data.length));
    if (result.data.length === 0) {
      thunkAPI.dispatch(
        setAlert({
          severity: "info",
          title: "Info",
          message: "Fetched all recipes.",
        })
      );
    }
    return { replace: params.replace, recipes: result.data };
  } catch (error: any) {
    thunkAPI.dispatch(
      setAlert({
        severity: "error",
        title: "Error",
        message: "Failed to fetch recipes, Please refresh the page.",
        details: error.response.data ? error.response.data : undefined,
      })
    );

    return thunkAPI.rejectWithValue({
      statusCode: error?.response?.status,
      data: error?.response?.data,
      message: error.message,
    });
  }
});

interface EditRecipeProps {
  recipeData: TRecipe;
  recipeId?: string;
}
export const editRecipe = createAsyncThunk<
  TRecipe[],
  EditRecipeProps,
  AsyncThunkConfig
>("recipes/editRecipe", async (props, thunkAPI) => {
  const state = thunkAPI.getState() as RootState;
  try {
    var editedRecipe = await axios.post(`/api/recipes/edit/${props.recipeId}`, {
      recipeData: props.recipeData,
    });

    thunkAPI.dispatch(
      setAlert({
        severity: "success",
        title: "Success",
        message: "Recipe edited successfully.",
      })
    );

    if (editedRecipe.data.approved || state.filters.ownerOnly) {
      return state.recipes.recipes.map((recipe: TRecipe) =>
        recipe._id === editedRecipe.data._id ? editedRecipe.data : recipe
      );
    }
    return state.recipes.recipes.filter(
      (recipe: TRecipe) => recipe._id !== editedRecipe.data._id
    );
  } catch (error: any) {
    thunkAPI.dispatch(
      setAlert({
        severity: "error",
        title: "Error",
        message: "Failed to edit recipe, Please try again.",
        details: error.response.data ? error.response.data : undefined,
      })
    );
    return thunkAPI.rejectWithValue({
      statusCode: error?.response?.status,
      data: error?.response?.data,
      message: error.message,
    });
  }
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
    thunkAPI.dispatch(
      setAlert({
        severity: "success",
        title: "Success",
        message: "Recipe deleted successfully",
      })
    );
    return state.recipes.recipes.filter(
      (recipe: TRecipe) => recipe._id !== props.id
    );
  } catch (error: any) {
    thunkAPI.dispatch(
      setAlert({
        severity: "error",
        title: "Error",
        message: "Failed to delete recipe, Please try again.",
        details: error.response.data ? error.response.data : undefined,
      })
    );
    return thunkAPI.rejectWithValue({
      statusCode: error?.response?.status,
      data: error?.response?.data,
      message: error.message,
    });
  }
});

interface AddRecipeProps {
  recipeData: TRecipe;
}
export const addRecipe = createAsyncThunk<
  TRecipe,
  AddRecipeProps,
  AsyncThunkConfig
>("recipes/addRecipe", async (props, thunkAPI) => {
  try {
    let result = await axios.post(`/api/recipes/new`, {
      recipeData: props.recipeData,
    });
    thunkAPI.dispatch(
      setAlert({
        severity: "success",
        title: "Success",
        message: "Recipe added successfully.",
      })
    );
    return result.data;
  } catch (error: any) {
    thunkAPI.dispatch(
      setAlert({
        severity: "error",
        title: "Error",
        message: "Failed to add recipe, Please try again.",
        details: error.response.data ? error.response.data : undefined,
      })
    );
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
    thunkAPI.dispatch(
      setAlert({
        severity: "error",
        title: "Error",
        message: "Failed to favorite recipe, Please try again.",
        details: error.response.data ? error.response.data : undefined,
      })
    );
    return thunkAPI.rejectWithValue({
      statusCode: error?.response?.status,
      data: error?.response?.data,
      message: error.message,
    });
  }
});
interface ApproveRecipeProps {
  _id: string;
  approve: boolean;
  reason?: string;
}
export const approveRecipe = createAsyncThunk<
  TRecipe[],
  ApproveRecipeProps,
  AsyncThunkConfig
>("recipes/approveRecipe", async (props, thunkAPI) => {
  const state = thunkAPI.getState() as RootState;

  try {
    let res = await axios.post(`/api/recipes/edit/approve/${props._id}`, {
      approve: props.approve,
      reason: props.reason,
    });
    //TODO return a single recipe instead of all of the recipes
    return state.recipes.recipes.filter(
      (recipe: TRecipe) => recipe._id !== props._id
    );
  } catch (error: any) {
    thunkAPI.dispatch(
      setAlert({
        severity: "error",
        title: "Error",
        message: "Failed to approve recipe, Please try again.",
        details: error.response.data ? error.response.data : undefined,
      })
    );
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
          if (action.payload.recipes) {
            // state.recipes = [...state.recipes, ...action.payload.recipes];
            state.recipes.push(...action.payload.recipes);
          }
        }
      })
      // .addCase(getRecipes.rejected, (state, action: PayloadAction<any>) => {})
      .addCase(editRecipe.fulfilled, (state, action) => {
        state.recipes = action.payload;
      })
      .addCase(addRecipe.fulfilled, (state, action) => {
        if (action.payload.approved) {
          state.recipes = [action.payload, ...state.recipes];
        }
      })
      .addCase(deleteRecipe.fulfilled, (state, action) => {
        state.recipes = action.payload;
      })
      .addCase(favoriteRecipe.fulfilled, (state, action) => {
        state.recipes = action.payload;
      })
      .addCase(approveRecipe.fulfilled, (state, action) => {
        state.recipes = action.payload;
      });
  },
});

export const { setFetchedAllRecipes, setRecipes } = recipesSlice.actions;

export default recipesSlice.reducer;
