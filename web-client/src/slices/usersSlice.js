import axios from "axios";
import {
  createSlice,
  createSelector,
  createAsyncThunk,
} from "@reduxjs/toolkit";

const initialState = {
  signedIn: false,
};

export const userPing = createAsyncThunk("user/userPing", async () => {
  try {
    var result = await axios.post("/api/login");
    return result.data;
  } catch (error) {
    if (error.response.status === 401) {
      return false;
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
  },
  extraReducers: (builder) => {
    builder.addCase(userPing.fulfilled, (state, action) => {
      state.signedIn = action.payload;
    });
  },
});

export const { setSignedIn } = usersSlice.actions;

export default usersSlice.reducer;
