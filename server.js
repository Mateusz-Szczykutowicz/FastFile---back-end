const express = require("express");
const app = express();

const config = require("./config.js");

app.listen(config.PORT, () => {
  console.log("Server is listening on port " + config.PORT);
});

module.exports = app;
