import mongoose from "mongoose";

const TokenSchema = mongoose.Schema(
  {
    createdAt: { type: Date, expires: "10m", default: Date.now },
    token: String,
    type: { type: String, enums: ["password_reset"] },
    user: { type: mongoose.Types.ObjectId, ref: "UserModel", required: true },
  },
  { collection: "tokens" }
);

export const Token = mongoose.model("TokenModel", TokenSchema);
