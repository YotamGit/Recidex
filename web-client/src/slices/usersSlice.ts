import axios from "axios";
import Cookies from "universal-cookie";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "../store";
import { setAlert } from "./utilitySlice";

interface UsersState {
  signedIn: boolean;
  attemptSignIn: boolean;
  wrongCredentials: boolean;
  userData: User;
  users: FullUser[];
}

const initialState: UsersState = {
  signedIn: false,
  attemptSignIn: false,
  wrongCredentials: false,
  userData: {
    _id: undefined,
    username: undefined,
    firstname: undefined,
    lastname: undefined,
    role: undefined,
    email: undefined,
  },
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
  _id: string | undefined;
  username: string | undefined;
  firstname: string | undefined;
  lastname: string | undefined;
  email: string | undefined;
  role: string | undefined;
};

//an interface used for users that are being used in the users table
// in admin panel.
export interface FullUser {
  _id: string;
  role: string;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  registration_date: string;
  last_sign_in: string;
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
    thunkAPI.dispatch(setAttemptSignIn(false));
    if (error.response.status === 401) {
      thunkAPI.dispatch(setWrongCredentials(true));
    }

    thunkAPI.dispatch(
      setAlert({
        severity: "error",
        title: "Error",
        message: `Failed to ${
          props.action === "signup" ? "Sign Up" : "Log In"
        }.`,
        details: error.response.data ? error.response.data : undefined,
      })
    );

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
      _id: props.userId,
    });

    thunkAPI.dispatch(
      setAlert({
        severity: "success",
        title: "Success",
        message: "User deleted successfully",
      })
    );

    return state.users.users.filter(
      (user: FullUser) => user._id !== props.userId
    );
  } catch (error: any) {
    thunkAPI.dispatch(
      setAlert({
        severity: "error",
        title: "Error",
        message: "Failed to delete user, Please try again.",
        details: error.response.data ? error.response.data : undefined,
      })
    );

    return thunkAPI.rejectWithValue({
      statusCode: error?.response?.status,
      data: error?.response?.data,
      message: error.message,
    });
  }
});

interface EditUserProps {
  //tried to use user type but ts kept screaming at me
  userData: {
    _id?: string;
    role?: string;
    username?: string;
    firstname?: string;
    lastname?: string;
    email?: string;
  };
  action: "editSelf" | "editOther" | undefined;
}
export const editUser = createAsyncThunk<
  {
    action: "editSelf" | "editOther" | undefined;
    users?: FullUser[];
    userData?: User;
  },
  EditUserProps,
  AsyncThunkConfig
>("users/editUser", async (props, thunkAPI) => {
  const state = thunkAPI.getState() as RootState;
  try {
    await axios.post(`/api/users/user/edit`, {
      userData: props.userData,
    });

    thunkAPI.dispatch(
      setAlert({
        severity: "success",
        title: "Success",
        message: "User edited successfully",
      })
    );

    return {
      action: props.action,
      userData: props.userData as User,
      users: state.users.users.map((user: FullUser) =>
        user._id === props.userData._id ? { ...user, ...props.userData } : user
      ) as FullUser[],
    };
  } catch (error: any) {
    thunkAPI.dispatch(
      setAlert({
        severity: "error",
        title: "Error",
        message: "Failed to edit user, Please try again.",
        details: error.response.data ? error.response.data : undefined,
      })
    );

    return thunkAPI.rejectWithValue({
      statusCode: error?.response?.status,
      data: error?.response?.data,
      message: error.message,
    });
  }
});

export const getUsers = createAsyncThunk<FullUser[], {}, AsyncThunkConfig>(
  "users/getUsers",
  async (props, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    try {
      let res = await axios.get("/api/users");
      return res.data;
    } catch (error: any) {
      thunkAPI.dispatch(
        setAlert({
          severity: "error",
          title: "Error",
          message: "Failed to fetch users, Please try again.",
          details: error.response.data ? error.response.data : undefined,
        })
      );
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
      state.attemptSignIn = action.payload;
    },
    setWrongCredentials(state, action: PayloadAction<boolean>) {
      state.wrongCredentials = action.payload;
    },
    setUserData(
      state,
      action: PayloadAction<{ userData: User; token: string; action?: string }>
    ) {
      state.userData._id = action.payload.userData._id;
      state.userData.username = action.payload.userData.username;
      state.userData.firstname = action.payload.userData.firstname;
      state.userData.lastname = action.payload.userData.lastname;
      state.userData.role = action.payload.userData.role;
      state.userData.email = action.payload.userData.email;
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
      localStorage.setItem("userRole", state.userData.role || "guest");
    },
    clearUserData(state) {
      state.signedIn = false;
      state.userData._id = undefined;
      state.userData.role = undefined;
      state.userData.username = undefined;
      state.userData.firstname = undefined;
      state.userData.lastname = undefined;
      state.userData.email = undefined;

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
      .addCase(signInUser.pending, (state) => {
        state.attemptSignIn = true;
      })
      .addCase(signInUser.fulfilled, (state, action) => {
        state.attemptSignIn = false;
        state.wrongCredentials = false;
        usersSlice.caseReducers.setUserData(state, action);
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
            state.userData._id = action.payload.userData._id;
            state.userData.role = action.payload.userData.role;
            state.userData.username = action.payload.userData.username;
            state.userData.firstname = action.payload.userData.firstname;
            state.userData.lastname = action.payload.userData.lastname;
            state.userData.email = action.payload.userData.email;
            localStorage.setItem("signedIn", String(state.signedIn));
            localStorage.setItem("userRole", String(state.userData.role));
          }
        }
      })
      .addCase(userPing.rejected, (state, action: PayloadAction<any>) => {
        state.attemptSignIn = false;
        if (action.payload.statusCode === 409) {
          usersSlice.caseReducers.clearUserData(state);
          //this is copy pasted from setUserData becuase i could not
          //find a way to use it from here since the action is of rejected type
          state.signedIn = true;
          state.userData._id = action.payload.data.userData._id;
          state.userData.role = action.payload.data.userData.role;
          state.userData.username = action.payload.data.userData.username;
          state.userData.firstname = action.payload.data.userData.firstname;
          state.userData.lastname = action.payload.data.userData.lastname;
          state.userData.email = action.payload.data.userData.email;

          let expiration_date = new Date();
          expiration_date.setFullYear(expiration_date.getFullYear() + 2);
          const cookies = new Cookies();
          cookies.set("userToken", action.payload.data.token, {
            path: "/",
            expires: expiration_date,
            sameSite: "strict",
          });
          localStorage.setItem("signedIn", String(state.signedIn));
          localStorage.setItem("userRole", state.userData.role || "guest");
        } else if (action.payload.statusCode === 401) {
          usersSlice.caseReducers.clearUserData(state);
        }
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(editUser.fulfilled, (state, action) => {
        if (action.payload.action == "editSelf" && action.payload.userData) {
          state.userData.username = action.payload.userData.username;
          state.userData.firstname = action.payload.userData.firstname;
          state.userData.lastname = action.payload.userData.lastname;
          state.userData.role = action.payload.userData.role;
          state.userData.email = action.payload.userData.email;
        } else if (
          action.payload.action == "editOther" &&
          action.payload.users
        ) {
          state.users = action.payload.users;
        }
      });
  },
});

export const {
  setAttemptSignIn,
  setWrongCredentials,
  setUserData,
  clearUserData,
} = usersSlice.actions;

export default usersSlice.reducer;
