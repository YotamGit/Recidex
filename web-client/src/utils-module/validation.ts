import * as EmailValidator from "email-validator";

export function validUsername(username: string) {
  let res = username.length >= 6;
  if (!res) {
    window.alert(
      "Invalid Username. \nUsername must be at least 6 characters long."
    );
  }
  return res;
}
export function validPassword(password: string) {
  let res = password.length >= 6 && password.length <= 16;
  if (!res) {
    window.alert(
      "Invalid Password. \nPassword must be between 6 and 16 characters long."
    );
  }
  return res;
}

export async function validEmail(email: string) {
  let res = await EmailValidator.validate(email);
  if (!res) {
    window.alert("Invalid Email");
  }
  return res;
}
