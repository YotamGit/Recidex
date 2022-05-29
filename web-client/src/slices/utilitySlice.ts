import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AlertColor } from "@mui/material";

export type AlertType = {
  openAlert: boolean;
  severity: AlertColor;
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
  alert: {
    openAlert: false,
    severity: "info",
    message: undefined,
    details: undefined,
  },
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
    resetAlert(state) {
      state.alert.openAlert = false;
      state.alert.severity = "info";
      state.alert.message = undefined;
      state.alert.details = undefined;
    },
  },
});

export const { setFullscreen, addRouteToHistory, setAlert, resetAlert } =
  utilitySlice.actions;

export default utilitySlice.reducer;
