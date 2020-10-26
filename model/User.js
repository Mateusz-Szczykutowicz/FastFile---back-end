const mongoose = require("mongoose");

let User = new mongoose.Schema({
  name: String,
  login: String,
  password: String,
  admin: Boolean,
});

module.exports = mongoose.model("User", User);
