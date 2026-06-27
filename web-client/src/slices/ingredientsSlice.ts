import axios from "axios";
import Cookies from "universal-cookie";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "../store";
import { AsyncThunkConfig, AsyncThunkError } from "../types/asyncThunkConfig";
import { setAlert } from "./utilitySlice";

export const DATA_OPTIONS = [
  "ingredients",
  "ingredientCategories",
  "preparationMethods",
  "dimensionConversions",
  "measurementUnits",
] as const;

export type DataOptions = (typeof DATA_OPTIONS)[number];

export const DATA_FETCH_STATUS = {
  idle: "idle",
  loading: "loading",
  succeeded: "succeeded",
  failed: "failed",
} as const;

export type DataFetchStatus =
  (typeof DATA_FETCH_STATUS)[keyof typeof DATA_FETCH_STATUS]; //search how this works?

interface IngredientsState {
  ingredients: Ingredient[];
  ingredientCategories: IngredientCategory[];
  preparationMethods: PreparationMethod[];
  dimensionConversions: DimensionConversion[];
  measurementUnits: MeasurementUnit[];
  statuses: Record<DataOptions, DataFetchStatus>;
  errors: Record<DataOptions, ErrorInfo | null>;
}

const initialState: IngredientsState = {
  ingredients: [],
  ingredientCategories: [],
  preparationMethods: [],
  dimensionConversions: [],
  measurementUnits: [],
  statuses: {
    ingredients: DATA_FETCH_STATUS.idle,
    ingredientCategories: DATA_FETCH_STATUS.idle,
    preparationMethods: DATA_FETCH_STATUS.idle,
    dimensionConversions: DATA_FETCH_STATUS.idle,
    measurementUnits: DATA_FETCH_STATUS.idle,
  },
  errors: {
    ingredients: null,
    ingredientCategories: null,
    preparationMethods: null,
    dimensionConversions: null,
    measurementUnits: null,
  },
};

type ErrorInfo = {
  message: string;
  code?: number;
  details?: unknown;
  timestamp?: number;
};

//todo: enforce union types for certain properties
type Ingredient = {
  _id: string | undefined;
  item_id: Number;
  item_name_english: String;
  item_name_hebrew: String;
  category: Number;
  preferred_shopping_dimension: String;
};

type IngredientCategory = {
  _id: string | undefined;
  category_id: Number;
  category_name_english: String;
  category_name_hebrew: String;
};

type PreparationMethod = {
  _id: string | undefined;
  prep_id: Number;
  prep_name_english: String;
  prep_name_hebrew: String;
  affects_weight: Boolean;
};

type DimensionConversion = {
  _id: string | undefined;
  item_id: Number; //ingredient
  from_unit_id: Number;
  to_unit_id: Number;
  prep_id: Number;
  factor: Number;
  source: String;
  confidence: String;
};

type MeasurementUnit = {
  _id: string | undefined;
  unit_id: Number;
  unit_name_english: String;
  unit_abbreviation_english: String;
  unit_name_hebrew: String;
  unit_abbreviation_hebrew: String;
  dimension: String;
  to_base_factor: Number;
};

export const getIngredients = createAsyncThunk<
  Ingredient[],
  void,
  AsyncThunkConfig
>("ingredients/getIngredients", async (props, thunkAPI) => {
  try {
    let result = await axios.post("/api/ingredients");
    return result.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({
      statusCode: error?.response?.status,
      data: error?.response?.data,
      message: error.message,
    });
  }
});

export const getIngredientCategories = createAsyncThunk<
  IngredientCategory[],
  void,
  AsyncThunkConfig
>("ingredients/getIngredientCategories", async (props, thunkAPI) => {
  try {
    let result = await axios.post("/api/ingredients/categories");
    return result.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({
      statusCode: error?.response?.status,
      data: error?.response?.data,
      message: error.message,
    });
  }
});

export const getPreparationMethods = createAsyncThunk<
  PreparationMethod[],
  void,
  AsyncThunkConfig
>("ingredients/getPreparationMethods", async (props, thunkAPI) => {
  try {
    let result = await axios.post("/api/ingredients/prep-methods");
    return result.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({
      statusCode: error?.response?.status,
      data: error?.response?.data,
      message: error.message,
    });
  }
});

export const getDimensionConversions = createAsyncThunk<
  DimensionConversion[],
  void,
  AsyncThunkConfig
>("ingredients/getDimensionConversions", async (props, thunkAPI) => {
  try {
    let result = await axios.post("/api/ingredients/dimension-conversion");
    return result.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({
      statusCode: error?.response?.status,
      data: error?.response?.data,
      message: error.message,
    });
  }
});

export const getMeasurementUnits = createAsyncThunk<
  MeasurementUnit[],
  void,
  AsyncThunkConfig
>("ingredients/getMeasurementUnits", async (props, thunkAPI) => {
  try {
    let result = await axios.post("/api/ingredients/measurement-units");
    return result.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({
      statusCode: error?.response?.status,
      data: error?.response?.data,
      message: error.message,
    });
  }
});

export const loadIngredientData = createAsyncThunk<
  void,
  { requiredData?: DataOptions[] },
  AsyncThunkConfig
>("ingredients/loadIngredientData", async (args, thunkAPI) => {
  const lists: DataOptions[] = args?.requiredData ?? [...DATA_OPTIONS];
  const state = thunkAPI.getState() as RootState;
  const tasks: Promise<any>[] = [];
  const shouldFetch = (status: DataFetchStatus): boolean =>
    status !== DATA_FETCH_STATUS.loading &&
    status !== DATA_FETCH_STATUS.succeeded;

  if (lists.includes("ingredients")) {
    const status: DataFetchStatus = state.ingredients.statuses.ingredients;
    if (shouldFetch(status)) tasks.push(thunkAPI.dispatch(getIngredients()));
  }

  if (lists.includes("ingredientCategories")) {
    const status: DataFetchStatus =
      state.ingredients.statuses.ingredientCategories;
    if (shouldFetch(status))
      tasks.push(thunkAPI.dispatch(getIngredientCategories()));
  }

  if (lists.includes("preparationMethods")) {
    const status: DataFetchStatus =
      state.ingredients.statuses.preparationMethods;
    if (shouldFetch(status))
      tasks.push(thunkAPI.dispatch(getPreparationMethods()));
  }

  if (lists.includes("dimensionConversions")) {
    const status: DataFetchStatus =
      state.ingredients.statuses.dimensionConversions;
    if (shouldFetch(status))
      tasks.push(thunkAPI.dispatch(getDimensionConversions()));
  }

  if (lists.includes("measurementUnits")) {
    const status: DataFetchStatus = state.ingredients.statuses.measurementUnits;
    if (shouldFetch(status))
      tasks.push(thunkAPI.dispatch(getMeasurementUnits()));
  }

  if (tasks.length) await Promise.all(tasks);
});

// interface signInUserProps {
//   userData: {
//     firstname: string;
//     lastname: string;
//     email: string;
//     username: string;
//     password: string;
//   };
//   action: string;
// }
// export const signInUser = createAsyncThunk<
//   {
//     userData: User;
//     token: string;
//   },
//   signInUserProps,
//   AsyncThunkConfig
// >("users/signInUser", async (props, thunkAPI) => {
//   try {
//     let result = await axios.post(
//       `/api/login${props.action === "signup" ? "/signup" : ""}`,
//       {
//         firstname:
//           props.action === "signup" ? props.userData.firstname : undefined,
//         lastname:
//           props.action === "signup" ? props.userData.lastname : undefined,
//         email: props.action === "signup" ? props.userData.email : undefined,
//         username: props.userData.username,
//         password: props.userData.password,
//       },
//     );
//     return {
//       userData: result.data.userData,
//       token: result.data.token,
//       action: props.action,
//     };
//   } catch (error: any) {
//     thunkAPI.dispatch(setAttemptSignIn(false));
//     if (error.response.status === 401) {
//       thunkAPI.dispatch(setWrongCredentials(true));
//     }

//     thunkAPI.dispatch(
//       setAlert({
//         severity: "error",
//         title: "Error",
//         message: `Failed to ${
//           props.action === "signup" ? "Sign Up" : "Log In"
//         }.`,
//         details: error.response.data ? error.response.data : undefined,
//       }),
//     );

//     return thunkAPI.rejectWithValue({
//       statusCode: error?.response?.status,
//       data: error?.response?.data,
//       message: error.message,
//     });
//   }
// });

const ingredientsSlice = createSlice({
  name: "ingredients",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state, action) => {
        state.statuses.ingredients = DATA_FETCH_STATUS.loading;
        state.errors.ingredients = null;
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.statuses.ingredients = DATA_FETCH_STATUS.succeeded;
        state.ingredients = action.payload;
        state.errors.ingredients = null;
      })
      .addCase(getIngredients.rejected, (state, action) => {
        state.statuses.ingredients = DATA_FETCH_STATUS.failed;
        const payload: AsyncThunkError = action.payload as AsyncThunkError;
        state.errors.ingredients = {
          message:
            payload?.message ??
            action.error?.message ??
            "Failed to load ingredients",
          code: payload?.statusCode,
          details: payload?.data ?? action.error,
          timestamp: Date.now(),
        };
      })
      .addCase(getIngredientCategories.pending, (state, action) => {
        state.statuses.ingredientCategories = DATA_FETCH_STATUS.loading;
        state.errors.ingredientCategories = null;
        // state.ingredients = action.payload;
      })
      .addCase(getIngredientCategories.fulfilled, (state, action) => {
        state.statuses.ingredientCategories = DATA_FETCH_STATUS.succeeded;
        state.ingredientCategories = action.payload;
        state.errors.ingredientCategories = null;
        // state.ingredients = action.payload;
      })
      .addCase(getIngredientCategories.rejected, (state, action) => {
        state.statuses.ingredientCategories = DATA_FETCH_STATUS.failed;
        const payload: AsyncThunkError = action.payload as AsyncThunkError;
        state.errors.ingredientCategories = {
          message:
            payload?.message ??
            action.error?.message ??
            "Failed to load ingredient categories",
          code: payload?.statusCode,
          details: payload?.data ?? action.error,
          timestamp: Date.now(),
        };
      })
      .addCase(getPreparationMethods.pending, (state, action) => {
        state.statuses.preparationMethods = DATA_FETCH_STATUS.loading;
        state.errors.preparationMethods = null;
        // state.ingredients = action.payload;
      })
      .addCase(getPreparationMethods.fulfilled, (state, action) => {
        state.statuses.preparationMethods = DATA_FETCH_STATUS.succeeded;
        state.preparationMethods = action.payload;
        state.errors.preparationMethods = null;
        // state.ingredients = action.payload;
      })
      .addCase(getPreparationMethods.rejected, (state, action) => {
        state.statuses.preparationMethods = DATA_FETCH_STATUS.failed;
        const payload: AsyncThunkError = action.payload as AsyncThunkError;
        state.errors.preparationMethods = {
          message:
            payload?.message ??
            action.error?.message ??
            "Failed to load preparation methods",
          code: payload?.statusCode,
          details: payload?.data ?? action.error,
          timestamp: Date.now(),
        };
      })
      .addCase(getDimensionConversions.pending, (state, action) => {
        state.statuses.dimensionConversions = DATA_FETCH_STATUS.loading;
        state.errors.dimensionConversions = null;
      })
      .addCase(getDimensionConversions.fulfilled, (state, action) => {
        state.statuses.dimensionConversions = DATA_FETCH_STATUS.succeeded;
        state.dimensionConversions = action.payload;
        state.errors.dimensionConversions = null;
      })
      .addCase(getDimensionConversions.rejected, (state, action) => {
        state.statuses.dimensionConversions = DATA_FETCH_STATUS.failed;
        const payload: AsyncThunkError = action.payload as AsyncThunkError;
        state.errors.dimensionConversions = {
          message:
            payload?.message ??
            action.error?.message ??
            "Failed to load dimension conversions",
          code: payload?.statusCode,
          details: payload?.data ?? action.error,
          timestamp: Date.now(),
        };
      })
      .addCase(getMeasurementUnits.pending, (state, action) => {
        state.statuses.measurementUnits = DATA_FETCH_STATUS.loading;
        state.errors.measurementUnits = null;
      })
      .addCase(getMeasurementUnits.fulfilled, (state, action) => {
        state.statuses.measurementUnits = DATA_FETCH_STATUS.succeeded;
        state.measurementUnits = action.payload;
        state.errors.measurementUnits = null;
      })
      .addCase(getMeasurementUnits.rejected, (state, action) => {
        state.statuses.measurementUnits = DATA_FETCH_STATUS.failed;
        const payload: AsyncThunkError = action.payload as AsyncThunkError;
        state.errors.measurementUnits = {
          message:
            payload?.message ??
            action.error?.message ??
            "Failed to load measurment units",
          code: payload?.statusCode,
          details: payload?.data ?? action.error,
          timestamp: Date.now(),
        };
      });
  },
});

export const {} = ingredientsSlice.actions;

export default ingredientsSlice.reducer;
