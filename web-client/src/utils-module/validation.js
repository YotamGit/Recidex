exports.validUsername = (username) => {
  return username.length >= 6;
};
exports.validPassword = (password) => {
  return password.length >= 6 && password.length <= 16;
};

exports.validEmail = (email) => {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
};
