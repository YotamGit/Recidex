const jwt = require("jsonwebtoken");

exports.generateToken = (userData) => {
  let jwtSecretKey = process.env.JWT_SECRET_KEY;
  let data = {
    time: Date(),
    firstname: userData.firstname,
    lastname: userData.lastname,
    userId: userData._id,
  };
  console.log(data);
  const token = jwt.sign(data, jwtSecretKey);

  return token;
};

exports.validateToken = (token) => {
  let jwtSecretKey = process.env.JWT_SECRET_KEY;
  const verified = jwt.verify(token, jwtSecretKey);

  return verified;
};

//check if the user is real using the token
exports.authenticateUser = (req, res, next) => {
  try {
    let token = this.validateToken(req.body.headers.Authentication);
    req.body.headers.validatedToken = token;
    console.log(`Authorized API access User ${token.userId} at ${new Date()}`);
    next();
  } catch (err) {
    console.log(`Unauthorized API access at ${new Date()}`);
    res.status(401).send("Unauthorized, provide valid credentials.");
  }
};

//check that the user owns the recipe or is an admin
exports.authenticateRecipeOwnership = (validatedToken, recipe) => {
  console.log(validatedToken.userId);
  console.log(recipe.owner);
  //use === and convert validated token id to string. with == there is no need
  if (validatedToken.userId == recipe.owner) {
    return true;
  } else {
    return false;
  }
};
