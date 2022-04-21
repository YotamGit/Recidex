import axios from "axios";
import {
  createSlice,
  createSelector,
  createAsyncThunk,
} from "@reduxjs/toolkit";

const initialState = {
  signedIn: false,
  attemptSignIn: false,
  userId: undefined,
  firstname: undefined,
  lastname: undefined,
};

export const userPing = createAsyncThunk("user/userPing", async () => {
  try {
    var result = await axios.post("/api/login/ping", {
      headers: {
        Authentication: localStorage.getItem("userToken"),
      },
    });
    return result.data;
  } catch (error) {
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
    setSignedIn(state, action) {
      const signedIn = action.payload;
      state.signedIn = signedIn;
    },
    setAttemptSignIn(state, action) {
      const attemptSignIn = action.payload;
      state.attemptSignIn = attemptSignIn;
    },
    setUserId(state, action) {
      const userId = action.payload;
      state.userId = userId;
    },
    setFirstname(state, action) {
      const firstname = action.payload;
      state.firstname = firstname;
    },
    setLastname(state, action) {
      const lastname = action.payload;
      state.lastname = lastname;
    },
    clearUser(state, action) {
      state.firstname = undefined;
      state.lastname = undefined;
      state.signedIn = false;
      state.userId = undefined;
      localStorage.clear();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(userPing.pending, (state, action) => {
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
  attemptSignIn,
  setSignedIn,
  setUserId,
  setFirstname,
  setLastname,
  clearUser,
} = usersSlice.actions;

export default usersSlice.reducer;
