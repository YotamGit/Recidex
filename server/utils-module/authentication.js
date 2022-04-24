import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export function generateToken(userData) {
  let jwtSecretKey = process.env.JWT_SECRET_KEY;
  let data = {
    time: Date(),
    firstname: userData.firstname,
    lastname: userData.lastname,
    userId: userData._id,
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
  //to use use === convert validated token id to string.
  //with == there is no need to do so.
  let user = await User.findById(validatedToken.userId);
  return validatedToken.userId == recipe.owner || user.role === "admin";
}
