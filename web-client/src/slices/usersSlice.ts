import axios from "axios";
import Cookies from "universal-cookie";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "../store";

interface UsersState {
  signedIn: boolean;
  attemptSignIn: boolean;
  wrongCredentials: boolean;
  userId: string | undefined;
  firstname: string | undefined;
  lastname: string | undefined;
  userRole: string | undefined;
  users: FullUser[];
}

const initialState: UsersState = {
  signedIn: false,
  attemptSignIn: false,
  wrongCredentials: false,
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
    token?: string;
  },
  {},
  AsyncThunkConfig
>("users/userPing", async (props, thunkAPI) => {
  try {
    let result = await axios.post("/api/login/ping");
    return result.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue({
      statusCode: error?.response?.status,
      data: error?.response?.data,
      message: error.message,
    });
  }
});

interface signInUserProps {
  userData: {
    firstname: string;
    lastname: string;
    email: string;
    username: string;
    password: string;
  };
  action: string;
}
export const signInUser = createAsyncThunk<
  {
    userData: User;
    token: string;
  },
  signInUserProps,
  AsyncThunkConfig
>("users/signInUser", async (props, thunkAPI) => {
  try {
    let result = await axios.post(
      `/api/login${props.action === "signup" ? "/signup" : ""}`,
      {
        firstname:
          props.action === "signup" ? props.userData.firstname : undefined,
        lastname:
          props.action === "signup" ? props.userData.lastname : undefined,
        email: props.action === "signup" ? props.userData.email : undefined,
        username: props.userData.username,
        password: props.userData.password,
      }
    );
    return {
      userData: result.data.userData,
      token: result.data.token,
      action: props.action,
    };
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
interface EditUserProps {
  id: string;
  role: string;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
}
export const editUser = createAsyncThunk<
  FullUser[],
  EditUserProps,
  AsyncThunkConfig
>("users/editUser", async (props, thunkAPI) => {
  const state = thunkAPI.getState() as RootState;
  try {
    await axios.post(`/api/users/user/edit`, {
      userData: props,
    });
  } catch (error: any) {
    return thunkAPI.rejectWithValue({
      statusCode: error?.response?.status,
      data: error?.response?.data,
      message: error.message,
    });
  }

  return state.users.users.map((user: FullUser) =>
    user._id === props.id ? { ...user, ...props } : user
  );
});

export const getUsers = createAsyncThunk<FullUser[], {}, AsyncThunkConfig>(
  "users/getUsers",
  async (props, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    try {
      let res = await axios.get("/api/users");
      return res.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({
        statusCode: error?.response?.status,
        data: error?.response?.data,
        message: error.message,
      });
    }
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setAttemptSignIn(state, action: PayloadAction<boolean>) {
      const attemptSignIn = action.payload;
      state.attemptSignIn = attemptSignIn;
    },
    setUserData(
      state,
      action: PayloadAction<{ userData: User; token: string; action?: string }>
    ) {
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
      .addCase(getUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(getUsers.rejected, (state, action: PayloadAction<any>) => {
        if (action.payload.statusCode === 403) {
          window.alert(
            "Failed to fetch users.\nReason: " + action.payload.data
          );
        } else {
          window.alert(
            "Failed to fetch users.\nReason: " + action.payload.message
          );
        }
      })
      .addCase(signInUser.pending, (state) => {
        state.attemptSignIn = true;
      })
      .addCase(signInUser.fulfilled, (state, action) => {
        state.attemptSignIn = false;
        usersSlice.caseReducers.setUserData(state, action);
      })
      .addCase(signInUser.rejected, (state, action: PayloadAction<any>) => {
        state.attemptSignIn = false;
        if (
          action.payload.action === "login" &&
          action.payload.statusCode === 401
        ) {
          state.wrongCredentials = true;
        } else if (
          action.payload.action === "signup" &&
          action.payload.statusCode === 409
        ) {
          window.alert("Failed to Sign Up.\nReason: " + action.payload.data);
        } else {
          window.alert(
            `Failed to ${
              action.payload.action === "signup" ? "Sign Up" : "Log In"
            }.\nReason: ` + action.payload.message
          );
        }
      })
      .addCase(userPing.pending, (state) => {
        state.attemptSignIn = true;
      })
      .addCase(userPing.fulfilled, (state, action) => {
        state.attemptSignIn = false;
        if (action.payload?.token) {
        } else {
          state.signedIn = action.payload?.authenticated || false;
          if (action.payload?.authenticated) {
            state.firstname = action.payload.userData.firstname;
            state.lastname = action.payload.userData.lastname;
            state.userId = action.payload.userData.userId;
            state.userRole = action.payload.userData.userRole;
            localStorage.setItem("signedIn", String(state.signedIn));
            localStorage.setItem("userRole", String(state.userRole));
          }
        }
      })
      .addCase(userPing.rejected, (state, action: PayloadAction<any>) => {
        state.attemptSignIn = false;
        if (action.payload.statusCode === 409) {
          usersSlice.caseReducers.clearUserData(state);
          //this is copy pasted from setUserData becuase i could not
          //find a way to use it from here since the action is of rejected type
          state.userId = action.payload.data.userData.userId;
          state.firstname = action.payload.data.userData.firstname;
          state.lastname = action.payload.data.userData.lastname;
          state.userRole = action.payload.data.userData.userRole;
          state.signedIn = true;

          let expiration_date = new Date();
          expiration_date.setFullYear(expiration_date.getFullYear() + 2);
          const cookies = new Cookies();
          cookies.set("userToken", action.payload.data.token, {
            path: "/",
            expires: expiration_date,
            sameSite: "strict",
          });
          localStorage.setItem("signedIn", String(state.signedIn));
          localStorage.setItem("userRole", state.userRole || "guest");
        } else if (action.payload.statusCode === 401) {
          usersSlice.caseReducers.clearUserData(state);
        }
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
      })
      .addCase(editUser.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(editUser.rejected, (state, action: PayloadAction<any>) => {
        if ([403, 404].includes(action.payload.statusCode)) {
          window.alert(
            "Failed to Edit User in Database.\nReason: " + action.payload.data
          );
        } else {
          window.alert(
            "Failed to Edit User in Database, Please Try Again.\nReason: " +
              action.payload.message
          );
        }
      });
  },
});

export const { setAttemptSignIn, setUserData, clearUserData } =
  usersSlice.actions;

export default usersSlice.reducer;
