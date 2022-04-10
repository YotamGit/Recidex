import * as EmailValidator from "email-validator";

export function validUsername(username) {
  return username.length >= 6;
}
export function validPassword(password) {
  return password.length >= 6 && password.length <= 16;
}

export function validEmail(email) {
  return EmailValidator.validate(email);
}
