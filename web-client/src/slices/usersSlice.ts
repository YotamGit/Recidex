import axios from "axios";
import Cookies from "universal-cookie";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

export type User = {
  userId: string | undefined;
  firstname: string | undefined;
  lastname: string | undefined;
  role: string | undefined;
};

interface UsersState {
  signedIn: boolean;
  attemptSignIn: boolean;
  userId: string | undefined;
  firstname: string | undefined;
  lastname: string | undefined;
  role: string | undefined;
}

const initialState: UsersState = {
  signedIn: false,
  attemptSignIn: false,
  userId: undefined,
  firstname: undefined,
  lastname: undefined,
  role: undefined,
};

export const userPing = createAsyncThunk<{
  authenticated: boolean;
  userData: User;
}>("user/userPing", async () => {
  try {
    let result = await axios.post("/api/login/ping", {});
    return result.data;
  } catch (error: any) {
    if (error.response.status === 401) {
      return error.response.data;
    } else {
      window.alert(
        "Error Trying to Log In Automatically.\nReason: " + error.message
      );
    }
  }
});

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setAttemptSignIn(state, action: PayloadAction<boolean>) {
      const attemptSignIn = action.payload;
      state.attemptSignIn = attemptSignIn;
    },
    setUserData(state, action: PayloadAction<{ userData: User; token: any }>) {
      state.userId = action.payload.userData.userId;
      state.firstname = action.payload.userData.firstname;
      state.lastname = action.payload.userData.lastname;
      state.role = action.payload.userData.role;
      state.signedIn = true;

      let expiration_date = new Date();
      expiration_date.setFullYear(expiration_date.getFullYear() + 2);
      const cookies = new Cookies();
      cookies.set("userToken", action.payload.token, {
        path: "/",
        expires: expiration_date,
        sameSite: "strict",
      });
    },
    clearUserData(state) {
      state.firstname = undefined;
      state.lastname = undefined;
      state.signedIn = false;
      state.userId = undefined;
      const cookies = new Cookies();
      cookies.remove("userToken", { path: "/" });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(userPing.pending, (state) => {
        state.attemptSignIn = true;
      })
      .addCase(userPing.fulfilled, (state, action) => {
        state.attemptSignIn = false;
        state.signedIn = action.payload?.authenticated || false;
        if (action.payload?.authenticated) {
          state.firstname = action.payload.userData.firstname;
          state.lastname = action.payload.userData.lastname;
          state.userId = action.payload.userData.userId;
          state.role = action.payload.userData.role;
        }
      });
  },
});

export const { setAttemptSignIn, setUserData, clearUserData } =
  usersSlice.actions;

export default usersSlice.reducer;
