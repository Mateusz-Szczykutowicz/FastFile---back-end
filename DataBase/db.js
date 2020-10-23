const mongoose = require("mongoose");
const config = require("../config");
mongoose.connect(config.data_base, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.set("useFindAndModify", false);

const db = mongoose.connection;

module.exports = db;
