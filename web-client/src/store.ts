import { configureStore } from "@reduxjs/toolkit";

import recipesReducer from "./slices/recipesSlice";
import usersReducer from "./slices/usersSlice";
import filtersReducer from "./slices/filtersSlice";
import utilityReducer from "./slices/utilitySlice";
import ingredientsReducer from "./slices/ingredientsSlice";

const store = configureStore({
  reducer: {
    users: usersReducer,
    recipes: recipesReducer,
    filters: filtersReducer,
    utilities: utilityReducer,
    ingredients: ingredientsReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
