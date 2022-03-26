const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    role: { type: String, enum: ["admin", "member", "guest"] },
    firstname: String,
    lastname: String,
    email: String,
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
  },
  { collection: "users" }
);

module.exports = mongoose.model("UserModel", UserSchema);
