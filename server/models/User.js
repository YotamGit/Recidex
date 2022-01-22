const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    role: String,
    firstname: String,
    lastname: String,
    username: String,
    password: String,
    registration_date: {
      type: Date,
      default: Date.now,
    },
    last_sign_in: {
      type: Date,
      default: Date.now,
    },
    liked_recipes: [mongoose.Types.ObjectId],
  },
  { collection: "users" }
);

module.exports = mongoose.model("UserModel", UserSchema);
