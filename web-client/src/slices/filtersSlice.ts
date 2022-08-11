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

export type SortParams = {
  field: string;
  direction: "ascending" | "descending";
};

type PaginationParams = { pageSize: number; pageNumber: number };

interface FiltersState {
  selectedFilters: TSelectedFilters;
  sort: SortParams;
  pagination: PaginationParams;
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
  recipe_sort_fields?: string[];
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
    direction: "descending",
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
  recipe_sort_fields: undefined,
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

export const getRecipeSortFields = createAsyncThunk<
  {
    recipe_sort_fields: string[];
  },
  {},
  AsyncThunkConfig
>("filters/getRecipeSortFields", async (props, thunkAPI) => {
  try {
    const options = await axios.get("/api/filters/recipe-sort-fields");
    return {
      recipe_sort_fields: options.data,
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
    setFilters(state, action: PayloadAction<TSelectedFilters>) {
      state.selectedFilters = { ...state.selectedFilters, ...action.payload };
    },
    setSort(state, action: PayloadAction<SortParams>) {
      state.sort = { ...state.sort, ...action.payload };
    },
    setPagination(state, action: PayloadAction<PaginationParams>) {
      state.pagination = { ...state.pagination, ...action.payload };
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
      })
      .addCase(getRecipeSortFields.fulfilled, (state, action) => {
        state.recipe_sort_fields = action.payload.recipe_sort_fields;
      });
  },
});

export const {
  setFilters,
  setSort,
  setPagination,
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
