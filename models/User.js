const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

let User = new mongoose.Schema(
  {
    login: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    email: String,
    role: {
      type: String,
      trim: true,
      lowercase: true,
      default: "User",
    },
  },
  { timestamps: true }
);

User.plugin(passportLocalMongoose, { usernameField: "login" });

module.exports = mongoose.model("User", User);
