import mongoose from "mongoose";

const TokenSchema = mongoose.Schema(
  {
    createdAt: { type: Date, expires: "2m", default: Date.now },
    token: String,
    type: String,
    user: { type: mongoose.Types.ObjectId, ref: "UserModel", required: true },
  },
  { collection: "tokens" }
);

export const Token = mongoose.model("TokenModel", TokenSchema);
