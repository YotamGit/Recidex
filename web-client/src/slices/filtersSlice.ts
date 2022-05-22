import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
  recipe_categories: {
    [key: string]: any;
    Proteins: string[];
    Salads: string[];
    Asian: string[];
    "Soups and Stews": string[];
    Pasta: string[];
    "Pizza and Focaccia": string[];
    Bread: string[];
    Drinks: string[];
    Desserts: string[];
    Other: string[];
  };
  recipe_difficulties: string[];
  recipe_durations: string[];
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
  recipe_categories: {
    Proteins: ["Meat", "Chicken", "Fish", "Other"],
    Salads: [],
    Asian: ["Japanese", "Chinese", "Thai", "Indian", "Other"],
    "Soups and Stews": ["Clear Soup", "Thick Soup", "Stew", "Other"],
    Pasta: [],
    "Pizza and Focaccia": [],
    Bread: ["Salty Pastries", "Other"],
    Drinks: ["Hot", "Cold", "Alcohol", "Other"],
    Desserts: [
      "Cookies",
      "Yeast",
      "Cakes",
      "Tarts and Pies",
      "Cup",
      "Snacks and Candies",
    ],
    Other: [],
  },
  recipe_difficulties: [
    "Very Easy",
    "Easy",
    "Medium",
    "Hard",
    "Very Hard",
    "Gordon Ramsay",
  ],
  recipe_durations: [
    "under 10 minutes",
    "10-20 minutes",
    "20-40 minutes",
    "40-60 minutes",
    "1-2 hours",
    "over 2 hours",
  ],
};

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
