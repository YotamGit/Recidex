import * as EmailValidator from "email-validator";

export function validUsername(username:string) {
  return username.length >= 6;
}
export function validPassword(password:string) {
  return password.length >= 6 && password.length <= 16;
}

export function validEmail(email:string) {
  return EmailValidator.validate(email);
}
