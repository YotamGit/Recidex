import axios from "axios";
import Cookies from "universal-cookie";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

export type User = {
  userId: string | undefined;
  firstname: string | undefined;
  lastname: string | undefined;
};

interface UsersState {
  signedIn: boolean;
  attemptSignIn: boolean;
  userId: string | undefined;
  firstname: string | undefined;
  lastname: string | undefined;
}
const initialState: UsersState = {
  signedIn: false,
  attemptSignIn: false,
  userId: undefined,
  firstname: undefined,
  lastname: undefined,
};

export const userPing = createAsyncThunk<{authenticated:boolean,userData:User}>("user/userPing", async () => {
  try {
    var result = await axios.post("/api/login/ping", {});
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
    setSignedIn(state, action:PayloadAction<boolean>) {
      const signedIn = action.payload;
      state.signedIn = signedIn;
    },
    setAttemptSignIn(state, action:PayloadAction<boolean>) {
      const attemptSignIn = action.payload;
      state.attemptSignIn = attemptSignIn;
    },
    setUserId(state, action:PayloadAction<string>) {
      const userId = action.payload;
      state.userId = userId;
    },
    setFirstname(state, action:PayloadAction<string>) {
      const firstname = action.payload;
      state.firstname = firstname;
    },
    setLastname(state, action:PayloadAction<string>) {
      const lastname = action.payload;
      state.lastname = lastname;
    },
    clearUser(state) {
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
        }
      });
  },
});

export const {
  setAttemptSignIn,
  setSignedIn,
  setUserId,
  setFirstname,
  setLastname,
  clearUser,
} = usersSlice.actions;

export default usersSlice.reducer;
