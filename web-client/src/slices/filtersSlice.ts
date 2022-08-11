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

export type TSelectedFilters = {
  [key: string]: any;
  category: string | undefined;
  sub_category: string | undefined;
  difficulty: string | undefined;
  prep_time: string | undefined;
  total_time: string | undefined;
};
interface FiltersState {
  selectedFilters: TSelectedFilters;
  sort: {
    field: "creation_time" | "last_update_time" | "favorite_count";
    direction: 1 | -1;
  };
  pagination: { pageSize: number; pageNumber: number };
  ownerOnly: boolean | undefined;
  privacyState: string;
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
  recipe_privacy_values?: string[];
}

const initialState: FiltersState = {
  selectedFilters: {
    category: undefined,
    sub_category: undefined,
    difficulty: undefined,
    prep_time: undefined,
    total_time: undefined,
  },
  sort: {
    field: "creation_time",
    direction: -1,
  },
  pagination: { pageSize: 16, pageNumber: 1 },
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

export const getRecipeFilterValues = createAsyncThunk<
  {
    recipe_categories: {
      [key: string]: any;
    };
    recipe_difficulties: string[];
    recipe_durations: string[];
  },
  {},
  AsyncThunkConfig
>("filters/getRecipeFilterValues", async (props, thunkAPI) => {
  try {
    const options = await axios.get("/api/filters/recipe-filter-values");
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

export const getRecipePrivacyValues = createAsyncThunk<
  {
    recipe_privacy_values: string[];
  },
  {},
  AsyncThunkConfig
>("filters/getRecipePrivacyValues", async (props, thunkAPI) => {
  try {
    const options = await axios.get("/api/filters/recipe-privacy-values");
    return {
      recipe_privacy_values: options.data,
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
    setPrivacyState(state, action: PayloadAction<string>) {
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
    builder
      .addCase(getRecipeFilterValues.fulfilled, (state, action) => {
        state.recipe_categories = action.payload.recipe_categories;
        state.recipe_difficulties = action.payload.recipe_difficulties;
        state.recipe_durations = action.payload.recipe_durations;
      })
      .addCase(getRecipePrivacyValues.fulfilled, (state, action) => {
        state.recipe_privacy_values = action.payload.recipe_privacy_values;
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
