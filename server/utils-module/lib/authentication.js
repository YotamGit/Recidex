const jwt = require("jsonwebtoken");

exports.generateToken = (userId) => {
  let jwtSecretKey = process.env.JWT_SECRET_KEY;
  let data = {
    time: Date(),
    userId: userId,
  };
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
  let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
  try {
    let authenticated = validateToken(req.header(tokenHeaderKey));
    // const correctPassword = req.cookies.password
    //   ? await bcrypt.compare(req.cookies.password, hashPassword)
    //   : false;
    // if (correctPassword) {
    //   next();
    // } else {
    //   res.status(401).send("Unauthorized, Login Required.");
    //   console.log(
    //     `\n${Date()} - Unauthorized ${req.method} Request, Url: ${
    //       req.originalUrl
    //     }`
    //   );
    // }
  } catch (err) {
    next(err);
  }
};

//check that the user owns the recipe or is an admin
exports.authenticateRecipeOwnership = (req, res, next) => {};
