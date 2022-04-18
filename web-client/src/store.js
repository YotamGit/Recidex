import { configureStore } from "@reduxjs/toolkit";

import recipesReducer from "./slices/recipesSlice";
import usersReducer from "./slices/usersSlice";
import filtersReducer from "./slices/filtersSlice";
import utilityReducer from "./slices/utilitySlice";

const store = configureStore({
  reducer: {
    users: usersReducer,
    recipes: recipesReducer,
    filters: filtersReducer,
    utilities: utilityReducer,
  },
});

export default store;
