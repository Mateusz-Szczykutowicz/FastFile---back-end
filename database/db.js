const mongoose = require("mongoose");
const config = require("../config.js");

mongoose.connect(config.db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.set("useFindAndModify", false);

const db = mongoose.connection;

module.exports = db;
