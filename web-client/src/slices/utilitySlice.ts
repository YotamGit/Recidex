import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type AlertType = {
  openAlert: boolean;
  message?: string;
  details?: string;
};
interface UtilityState {
  fullscreen: boolean | undefined;
  routeHistory: string[];
  alert: AlertType;
}

const initialState: UtilityState = {
  fullscreen: undefined,
  routeHistory: [],
  alert: { openAlert: false, message: undefined, details: undefined },
};

const utilitySlice = createSlice({
  name: "utility",
  initialState,
  reducers: {
    setFullscreen(state, action: PayloadAction<boolean>) {
      state.fullscreen = action.payload;
    },
    addRouteToHistory(state, action: PayloadAction<string>) {
      state.routeHistory.push(action.payload);
    },
    setAlert(
      state,
      action: PayloadAction<{
        open?: boolean;
        message?: string;
        details?: string;
      }>
    ) {
      state.alert.openAlert =
        action.payload.open !== undefined ? action.payload.open : true;
      state.alert.message = action.payload?.message;
      state.alert.details = action.payload?.details;
    },
  },
});

export const { setFullscreen, addRouteToHistory, setAlert } =
  utilitySlice.actions;

export default utilitySlice.reducer;
