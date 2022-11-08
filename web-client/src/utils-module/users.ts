import axios from "axios";
//redux
import store from "../store";
import { setAlert } from "../slices/utilitySlice";

export async function getAccountInfo(userId: string) {
  try {
    let response = await axios.get(`/api/users/user/account/info/${userId}`);
    return response.data;
  } catch (error: any) {
    store.dispatch(
      setAlert({
        severity: "error",
        title: "Error",
        message: "Failed to fetch account information.",
        details: error.response.data ? error.response.data : undefined,
      })
    );
  }
}

export async function getProfileInfo(userId: string) {
  try {
    var result = await axios.get(`/api/users/user/info/${userId}`);
    return result.data;
  } catch (err: any) {
    store.dispatch(
      setAlert({
        severity: "error",
        title: "Error",
        message: "Failed to Fetch User Info.",
        details: err.response.data ? err.response.data : undefined,
      })
    );
  }
}

export async function isUserExist(userId: string) {
  try {
    var result = await axios.get(`/api/users/user/exists/${userId}`);

    if (!result.data) {
      store.dispatch(
        setAlert({
          severity: "error",
          title: "Error",
          message: "Failed to Fetch User Info.",
          details: "User not found",
        })
      );
    }
    return result.data;
  } catch (err: any) {
    store.dispatch(
      setAlert({
        severity: "error",
        title: "Error",
        message: "Failed to Fetch User Info.",
        details: err.response.data ? err.response.data : undefined,
      })
    );
    return false;
  }
}

//GET USER KPI DATA
export async function getUserKpiData() {
  try {
    let count = await axios.get("/api/users/kpi-data");

    return count.data;
  } catch (error: any) {
    store.dispatch(
      setAlert({
        severity: "error",
        title: "Error",
        message: "Failed to get User KPI data.",
        details: error.response.data ? error.response.data : undefined,
      })
    );
  }
}
