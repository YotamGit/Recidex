import axios from "axios";
import {
  createSlice,
  createSelector,
  createAsyncThunk,
} from "@reduxjs/toolkit";

const initialState = {
  signedIn: false,
  userId: "",
  firstname: "",
  lastname: "",
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
  },
  extraReducers: (builder) => {
    builder.addCase(userPing.fulfilled, (state, action) => {
      state.signedIn = action.payload.authenticated;
      state.firstname = action.payload.userData.firstname;
      state.lastname = action.payload.userData.lastname;
      state.userId = action.payload.userData.userId;
    });
  },
});

export const { setSignedIn, setUserId, setFirstname, setLastname } =
  usersSlice.actions;

export default usersSlice.reducer;
