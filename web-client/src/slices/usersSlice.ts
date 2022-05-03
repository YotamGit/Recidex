import axios from "axios";
import Cookies from "universal-cookie";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "../store";

interface UsersState {
  signedIn: boolean;
  attemptSignIn: boolean;
  userId: string | undefined;
  firstname: string | undefined;
  lastname: string | undefined;
  userRole: string | undefined;
  users: FullUser[];
}

const initialState: UsersState = {
  signedIn: false,
  attemptSignIn: false,
  userId: undefined,
  firstname: undefined,
  lastname: undefined,
  userRole: undefined,
  users: [],
};

interface UsersSliceError {
  statusCode: number;
  data: string;
  message: string;
}

type AsyncThunkConfig = {
  /** return type for `thunkApi.getState` */
  state?: RootState;
  /** type for `thunkApi.dispatch` */
  dispatch?: AppDispatch;

  /** type to be passed into `rejectWithValue`'s first argument that will end up on `rejectedAction.payload` */
  rejectValue?: UsersSliceError;
};

//a user type used for user-data stored in the state after authentication
export type User = {
  userId: string | undefined;
  firstname: string | undefined;
  lastname: string | undefined;
  userRole: string | undefined;
};

//an interface used for users that are being used in the users table
// in admin panel.
export interface FullUser {
  _id: string;
  role: string;
  username: string;
  firstname: string;
  lastname: string;
  registration_date: string;
  last_sign_in: string;
  email: string;
}

export const userPing = createAsyncThunk<
  {
    authenticated: boolean;
    userData: User;
  },
  {},
  AsyncThunkConfig
>("users/userPing", async (props, thunkAPI) => {
  try {
    let result = await axios.post("/api/login/ping", {});
    return result.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({
      statusCode: error?.response?.status,
      data: error?.response?.data,
      message: error.message,
    });
  }
});

interface DeleteUserProps {
  userId: string;
}
export const deleteUser = createAsyncThunk<
  FullUser[],
  DeleteUserProps,
  AsyncThunkConfig
>("users/deleteUser", async (props, thunkAPI) => {
  const state = thunkAPI.getState() as RootState;
  try {
    let deletedUser = await axios.post("/api/users/user/delete", {
      id: props.userId,
    });
  } catch (error: any) {
    return thunkAPI.rejectWithValue({
      statusCode: error?.response?.status,
      data: error?.response?.data,
      message: error.message,
    });
  }
  return state.users.users.filter(
    (user: FullUser) => user._id !== props.userId
  );
});

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setAttemptSignIn(state, action: PayloadAction<boolean>) {
      const attemptSignIn = action.payload;
      state.attemptSignIn = attemptSignIn;
    },
    setUsers(state, action: PayloadAction<FullUser[]>) {
      state.users = action.payload;
    },
    setUserData(state, action: PayloadAction<{ userData: User; token: any }>) {
      state.userId = action.payload.userData.userId;
      state.firstname = action.payload.userData.firstname;
      state.lastname = action.payload.userData.lastname;
      state.userRole = action.payload.userData.userRole;
      state.signedIn = true;

      let expiration_date = new Date();
      expiration_date.setFullYear(expiration_date.getFullYear() + 2);
      const cookies = new Cookies();
      cookies.set("userToken", action.payload.token, {
        path: "/",
        expires: expiration_date,
        sameSite: "strict",
      });
      localStorage.setItem("signedIn", String(state.signedIn));
      localStorage.setItem("userRole", state.userRole || "guest");
    },
    clearUserData(state) {
      state.firstname = undefined;
      state.lastname = undefined;
      state.signedIn = false;
      state.userId = undefined;
      state.userRole = undefined;
      const cookies = new Cookies();
      cookies.remove("userToken", { path: "/" });
      localStorage.removeItem("signedIn");
      localStorage.removeItem("userRole");
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
          state.userRole = action.payload.userData.userRole;
          localStorage.setItem("signedIn", String(state.signedIn));
          localStorage.setItem("userRole", String(state.userRole));
        }
      })
      .addCase(userPing.rejected, (state, action: PayloadAction<any>) => {
        state.attemptSignIn = false;
        state.signedIn = action.payload?.authenticated || false;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(deleteUser.rejected, (state, action: PayloadAction<any>) => {
        if ([403, 404].includes(action.payload.statusCode)) {
          window.alert("Failed to delete user\nReason: " + action.payload.data);
        } else {
          window.alert(
            "Failed to delete user, Please Try Again.\nReason: " +
              action.payload.message
          );
        }
      });
  },
});

export const { setAttemptSignIn, setUsers, setUserData, clearUserData } =
  usersSlice.actions;

export default usersSlice.reducer;
