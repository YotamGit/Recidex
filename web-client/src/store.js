import { configureStore } from "@reduxjs/toolkit";

import recipesReducer from "./slices/recipesSlice";
import usersReducer from "./slices/usersSlice";
import filtersReducer from "./slices/filtersSlice";

const store = configureStore({
  reducer: {
    users: usersReducer,
    //recipes: recipesReducer,
    //filters: filtersReducer,
  },
});

export default store;
