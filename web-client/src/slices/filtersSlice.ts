import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "../store";
import axios from "axios";

interface FiltersSliceError {
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
  rejectValue?: FiltersSliceError;
};

export type recipePrivacyState =
  | "all"
  | "public"
  | "approved"
  | "pending approval"
  | "private";

export type TSelectedFilters = {
  [key: string]: any;
  category: string | undefined;
  sub_category: string | undefined;
  difficulty: string | undefined;
  prep_time: string | undefined;
  total_time: string | undefined;
};
interface FiltersState {
  selectedFilters: {
    [key: string]: any;
    category: string | undefined;
    sub_category: string | undefined;
    difficulty: string | undefined;
    prep_time: string | undefined;
    total_time: string | undefined;
  };
  ownerOnly: boolean | undefined;
  privacyState: recipePrivacyState;
  favoritesOnly: boolean | undefined;
  approvedOnly: boolean | undefined;
  approvalRequiredOnly: boolean | undefined;
  searchText: string | undefined;
  titleFilters: object | undefined;
  filtered: boolean;
  recipe_categories?: {
    [key: string]: any;
  };
  recipe_difficulties?: string[];
  recipe_durations?: string[];
}

const initialState: FiltersState = {
  selectedFilters: {
    category: undefined,
    sub_category: undefined,
    difficulty: undefined,
    prep_time: undefined,
    total_time: undefined,
  },
  ownerOnly: undefined,
  privacyState: "all",
  favoritesOnly: undefined,
  approvedOnly: undefined,
  approvalRequiredOnly: undefined,
  searchText: undefined,
  titleFilters: undefined,
  filtered: false,
  recipe_categories: undefined,
  recipe_difficulties: undefined,
  recipe_durations: undefined,
};

export const getRecipeOptions = createAsyncThunk<
  {
    recipe_categories: any;
    recipe_difficulties: any;
    recipe_durations: any;
  },
  {},
  AsyncThunkConfig
>("filters/getRecipeOptions", async (props, thunkAPI) => {
  try {
    const options = await axios.get("/api/recipes/recipe-options");
    return {
      recipe_categories: options.data.recipe_categories,
      recipe_difficulties: options.data.recipe_difficulties,
      recipe_durations: options.data.recipe_durations,
    };
  } catch (error: any) {
    return thunkAPI.rejectWithValue({
      statusCode: error?.response?.status,
      data: error?.response?.data,
      message: error.message,
    });
  }
});

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setFilters(state, action: PayloadAction<any>) {
      state.selectedFilters = { ...state.selectedFilters, ...action.payload };
    },
    setTitleFilters(state, action: PayloadAction<any>) {
      state.titleFilters = action.payload;
    },
    setSearchText(state, action: PayloadAction<string>) {
      state.searchText = action.payload === "" ? undefined : action.payload;
    },
    setOwnerOnly(state, action: PayloadAction<boolean>) {
      state.ownerOnly = action.payload;
    },
    setPrivacyState(state, action: PayloadAction<recipePrivacyState>) {
      state.privacyState = action.payload;
    },
    setApprovalRequiredOnly(state, action: PayloadAction<boolean>) {
      state.approvalRequiredOnly = action.payload;
    },
    setFavoritesOnly(state, action: PayloadAction<boolean>) {
      state.favoritesOnly = action.payload;
    },
    setApprovedOnly(state, action: PayloadAction<boolean>) {
      state.approvedOnly = action.payload;
    },
    setFiltered(state, action: PayloadAction<boolean>) {
      state.filtered = action.payload;
    },
    resetFilters(state) {
      Object.keys(state.selectedFilters).forEach((key) => {
        state.selectedFilters[key] = undefined;
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getRecipeOptions.fulfilled, (state, action) => {
      state.recipe_categories = action.payload.recipe_categories;
      state.recipe_difficulties = action.payload.recipe_difficulties;
      state.recipe_durations = action.payload.recipe_durations;
    });
  },
});

export const {
  setFilters,
  setTitleFilters,
  setFiltered,
  setOwnerOnly,
  setPrivacyState,
  setApprovalRequiredOnly,
  setSearchText,
  setFavoritesOnly,
  setApprovedOnly,
  resetFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;
