const mongoose = require("mongoose");

let User = new mongoose.Schema(
  {
    login: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: String,
    email: String,
    signature: String,
    role: {
      type: String,
      trim: true,
      lowercase: true,
      default: "User",
    },
    hash: String,
    salt: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", User);
