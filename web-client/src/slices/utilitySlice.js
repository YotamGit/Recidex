import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  fullscreen: undefined,
  routeHistory: [],
};

const utilitySlice = createSlice({
  name: "utility",
  initialState,
  reducers: {
    setFullscreen(state, action) {
      state.fullscreen = action.payload;
    },
    addRouteToHistory(state, action) {
      state.routeHistory.push(action.payload);
    },
  },
});

export const { setFullscreen, addRouteToHistory } = utilitySlice.actions;

export default utilitySlice.reducer;
