import { createSlice, PayloadAction} from "@reduxjs/toolkit";


interface UtilityState {
  fullscreen: boolean | undefined;
  routeHistory: string[];
}

const initialState: UtilityState = {
  fullscreen: undefined,
  routeHistory: [],
};

const utilitySlice = createSlice({
  name: "utility",
  initialState,
  reducers: {
    setFullscreen(state, action:PayloadAction<boolean>) {
      state.fullscreen = action.payload;
    },
    addRouteToHistory(state, action:PayloadAction<string>) {
      state.routeHistory.push(action.payload);
    },
  },
});

export const { setFullscreen, addRouteToHistory } = utilitySlice.actions;

export default utilitySlice.reducer;
