import * as EmailValidator from "email-validator";

//redux
import store from "../store";
import { setAlert } from "../slices/utilitySlice";

export function validUsername(username: string, showAlert?: boolean) {
  let res = username.length >= 6 && username.length <= 16;
  if (!res && showAlert) {
    store.dispatch(
      setAlert({
        severity: "warning",
        title: "Warning",
        message:
          "Invalid Username. \nUsername must be between 6 and 16 characters long.",
      })
    );
  }
  return res;
}
export function validPassword(password: string, showAlert?: boolean) {
  let res = password.length >= 6 && password.length <= 16;
  if (!res && showAlert) {
    store.dispatch(
      setAlert({
        severity: "warning",
        title: "Warning",
        message:
          "Invalid Password. \nPassword must be between 6 and 16 characters long.",
      })
    );
  }
  return res;
}

export async function validEmail(email: string, showAlert?: boolean) {
  let res = await EmailValidator.validate(email);
  console.log(res);
  if (!res && showAlert) {
    store.dispatch(
      setAlert({
        severity: "warning",
        title: "Warning",
        message: "Invalid Email.",
      })
    );
  }
  return res;
}
