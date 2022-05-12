import jwt from "jsonwebtoken";
import { User, roles } from "../models/User.js";

export function generateToken(userData) {
  let jwtSecretKey = process.env.JWT_SECRET_KEY;
  let data = {
    time: Date(),
    _id: userData._id,
    role: userData.role,
    username: userData.username,
    firstname: userData.firstname,
    lastname: userData.lastname,
  };
  const token = jwt.sign(data, jwtSecretKey);

  return token;
}

export function validateToken(token) {
  let jwtSecretKey = process.env.JWT_SECRET_KEY;
  try {
    const verified = jwt.verify(token, jwtSecretKey);
    return verified;
  } catch (error) {
    return undefined;
  }
}

//check if the user is real using the token
export function authenticateUser(req, res, next) {
  let token = validateToken(req.cookies.userToken);
  if (token) {
    req.headers.validatedToken = token;
    next();
  } else {
    res.status(401).send("Unauthorized, provide valid credentials.");
  }
}

//check that the user owns the recipe or is an admin
export async function authenticateRecipeOwnership(validatedToken, recipe) {
  //to use === , convert validated token id to string.
  //with == there is no need to do so.
  let user = await User.findById(validatedToken._id);
  return (
    validatedToken._id == recipe.owner ||
    ["admin", "moderator"].includes(user.role)
  );
}

//check if the user is a moderator
export async function isModeratorUser(validatedToken) {
  let user = await User.findById(validatedToken._id);
  return ["admin", "moderator"].includes(user.role);
}

//check if the user is an admin
export async function isAdminUser(validatedToken) {
  let user = await User.findById(validatedToken._id);
  return user.role === "admin";
}
//check if a user is allowed to perform changes on other user
export async function isAllowedToEditUser(validatedToken, edited) {
  let editor = await User.findById(validatedToken._id);
  let editorRole = roles.indexOf(editor.role);
  let editedRole = roles.indexOf(edited.role);

  return editor.role === "admin" ? true : editorRole < editedRole;
}

//check if an email already exists in the db
export async function isEmailTaken(email) {
  let user = await User.findOne({
    email: { $eq: email },
  });
  return user ? true : false;
}

//check if an username already exists in the db
export async function isUsernameTaken(username) {
  let user = await User.findOne({
    username: { $eq: username },
  });
  return user ? true : false;
}
