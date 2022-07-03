import axios from "axios";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "../store";
import { setAlert } from "./utilitySlice";

interface RecipesState {
  recipes: TRecipe[];
  fetchedAllRecipes: boolean;
  fetching: boolean;
}
const initialState: RecipesState = {
  recipes: [],
  fetchedAllRecipes: false,
  fetching: false,
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
  notes: string;
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
  abortController?: AbortController;
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
      signal: params.abortController
        ? params.abortController.signal
        : undefined,
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

    if (result.data.length === 0) {
      thunkAPI.dispatch(
        setAlert({
          severity: "info",
          title: "Info",
          message: "No recipes to fetch.",
        })
      );
    }
    return { replace: params.replace, recipes: result.data };
  } catch (error: any) {
    if (!params.abortController?.signal.aborted) {
      thunkAPI.dispatch(
        setAlert({
          severity: "error",
          title: "Error",
          message: "Failed to fetch recipes, Please refresh the page.",
          details: error.response?.data ? error.response?.data : undefined,
        })
      );
    }

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
    var editedRecipe: any = await axios.post(
      `/api/recipes/edit/${props.recipeId}`,
      {
        recipeData: props.recipeData,
      }
    );

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
    let result: any = await axios.post(`/api/recipes/new`, {
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
  { recipeId: string; favorited_by: string[] },
  FavoriteRecipeProps,
  AsyncThunkConfig
>("recipes/favoriteRecipe", async (props, thunkAPI) => {
  const state = thunkAPI.getState() as RootState;

  try {
    let res: any = await axios.post(`/api/recipes/edit/favorite/${props.id}`, {
      favorite: props.favorite,
    });
    //TODO return a single recipe instead of all of the recipes
    return { recipeId: props.id, favorited_by: res.data };
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
  fromModerationPage: boolean;
  _id: string;
  approve: boolean;
  reason?: string;
}
export const approveRecipe = createAsyncThunk<
  TRecipe,
  ApproveRecipeProps,
  AsyncThunkConfig
>("recipes/approveRecipe", async (props, thunkAPI) => {
  const state = thunkAPI.getState() as RootState;

  try {
    let res: any = await axios.post(`/api/recipes/edit/approve/${props._id}`, {
      approve: props.approve,
      reason: props.reason,
    });
    thunkAPI.dispatch(
      setAlert({
        severity: "success",
        title: "Success",
        message: `Recipe ${props.approve ? "approved" : "disapproved"}`,
      })
    );
    return res.data;
  } catch (error: any) {
    thunkAPI.dispatch(
      setAlert({
        severity: "error",
        title: "Error",
        message: "Failed to approve/disapprove recipe, Please try again.",
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
interface RequestApprovalProps {
  _id: string;
  approval_required: boolean;
}
export const requestApproval = createAsyncThunk<
  TRecipe,
  RequestApprovalProps,
  AsyncThunkConfig
>("recipes/requestApproval", async (props, thunkAPI) => {
  const state = thunkAPI.getState() as RootState;

  try {
    let res: any = await axios.post(
      `/api/recipes/edit/request-approval/${props._id}`,
      {
        approval_required: props.approval_required,
      }
    );
    thunkAPI.dispatch(
      setAlert({
        severity: "success",
        title: "Success",
        message: `Approval request ${
          props.approval_required ? "submitted" : "cancelled"
        } successfully`,
      })
    );
    return res.data;
  } catch (error: any) {
    thunkAPI.dispatch(
      setAlert({
        severity: "error",
        title: "Error",
        message: "Failed to request approval, Please try again.",
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
interface ChangePrivacyProps {
  _id: string;
  private: boolean;
}
export const changePrivacy = createAsyncThunk<
  TRecipe,
  ChangePrivacyProps,
  AsyncThunkConfig
>("recipes/changePrivacy", async (props, thunkAPI) => {
  const state = thunkAPI.getState() as RootState;

  try {
    let res: any = await axios.post(
      `/api/recipes/edit/change-privacy/${props._id}`,
      {
        private: props.private,
      }
    );
    thunkAPI.dispatch(
      setAlert({
        severity: "success",
        title: "Success",
        message: `Recipe privacy changed to ${
          props.private ? "Private" : "Public"
        } successfully`,
      })
    );

    return res.data;
  } catch (error: any) {
    thunkAPI.dispatch(
      setAlert({
        severity: "error",
        title: "Error",
        message: "Failed to change recipe privacy, Please try again.",
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
    setFetchedAllRecipes(state, action: PayloadAction<boolean>) {
      state.fetchedAllRecipes = action.payload;
    },
    setRecipes(state, action: PayloadAction<TRecipe[]>) {
      state.recipes = action.payload;
    },
    setFetching(state, action: PayloadAction<boolean>) {
      state.fetching = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRecipes.pending, (state, action) => {
        if (action.meta.arg.replace) {
          state.recipes = [];
          state.fetchedAllRecipes = false;
          state.fetching = true;
        }
        if (!state.fetchedAllRecipes) {
          state.fetching = true;
        }
      })
      .addCase(getRecipes.fulfilled, (state, action) => {
        if (action.payload.replace) {
          state.recipes = [...action.payload.recipes];
        } else {
          if (action.payload.recipes) {
            state.recipes.push(...action.payload.recipes);
          }
        }
        state.fetchedAllRecipes = action.payload.recipes.length === 0;
        state.fetching = false;
      })

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
        state.recipes = state.recipes.map((recipe: TRecipe) =>
          recipe._id === action.payload.recipeId
            ? { ...recipe, favorited_by: action.payload.favorited_by }
            : recipe
        );
      })
      .addCase(approveRecipe.fulfilled, (state, action) => {
        if (action.meta.arg.fromModerationPage) {
          state.recipes = state.recipes.filter(
            (recipe: TRecipe) => recipe._id !== action.payload._id
          );
        } else {
          state.recipes = state.recipes.map((recipe: TRecipe) =>
            recipe._id === action.payload._id ? action.payload : recipe
          );
        }
      })
      .addCase(requestApproval.fulfilled, (state, action) => {
        state.recipes = state.recipes.map((recipe: TRecipe) =>
          recipe._id === action.payload._id ? action.payload : recipe
        );
      })
      .addCase(changePrivacy.fulfilled, (state, action) => {
        state.recipes = state.recipes.map((recipe: TRecipe) =>
          recipe._id === action.payload._id ? action.payload : recipe
        );
      });
  },
});

export const { setFetchedAllRecipes, setRecipes, setFetching } =
  recipesSlice.actions;

export default recipesSlice.reducer;
