import jwt from "jsonwebtoken";
import { User, roles } from "../models/User.js";

export function generateToken(userData) {
  let jwtSecretKey = process.env.JWT_SECRET_KEY;
  let data = {
    time: Date(),
    firstname: userData.firstname,
    lastname: userData.lastname,
    userId: userData._id,
    userRole: userData.role,
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
  try {
    let token = validateToken(req.cookies.userToken);
    req.headers.validatedToken = token;
    next();
  } catch (err) {
    res.status(401).send("Unauthorized, provide valid credentials.");
  }
}

//check that the user owns the recipe or is an admin
export async function authenticateRecipeOwnership(validatedToken, recipe) {
  //to use === , convert validated token id to string.
  //with == there is no need to do so.
  let user = await User.findById(validatedToken.userId);
  return validatedToken.userId == recipe.owner || user.role === "admin";
}

//check if the user is a moderator
export async function isModeratorUser(validatedToken) {
  let user = await User.findById(validatedToken.userId);
  return ["admin", "moderator"].includes(user.role);
}

//check if the user is an admin
export async function isAdminUser(validatedToken) {
  let user = await User.findById(validatedToken.userId);
  return user.role === "admin";
}
//check if a user is allowed to perform changes on other user
export async function isAllowedToEditUser(validatedToken, edited) {
  let editor = await User.findById(validatedToken.userId);
  let editorRole = roles.indexOf(editor.role);
  let editedRole = roles.indexOf(edited.role);
  return editorRole > editedRole;
}
