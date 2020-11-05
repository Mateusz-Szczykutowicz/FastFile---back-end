const mongoose = require("mongoose");

let User = new mongoose.Schema({
  login: String,
  password: String,
  email: String,
  role: {
    type: String,
    trim: true,
    default: "User",
  },
});

User.set("timestamps", true);

module.exports = mongoose.model("User", User);
