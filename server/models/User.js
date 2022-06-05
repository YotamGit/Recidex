import mongoose from "mongoose";

//roles must remain in descending privileges order:
export const roles = ["admin", "moderator", "member"];
const UserSchema = mongoose.Schema(
  {
    role: { type: String, enum: roles },
    firstname: String,
    lastname: String,
    email: String,
    username: String,
    password: String,
    notification_opt_in: {
      type: Boolean,
      default: true,
    },
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

export const User = mongoose.model("UserModel", UserSchema);
