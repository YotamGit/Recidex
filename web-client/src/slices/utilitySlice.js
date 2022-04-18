import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  fullscreen: undefined,
};

const utilitySlice = createSlice({
  name: "utility",
  initialState,
  reducers: {
    setFullscreen(state, action) {
      state.fullscreen = action.payload;
    },
  },
});

export const { setFullscreen } = utilitySlice.actions;

export default utilitySlice.reducer;
