const express = require("express");
const router = express.Router();
const usersController = require("../controllers/api/usersController.js");

// [tmp]
const User = require("../models/User.js");
const sha256 = require("sha256");
const passport = require("passport");
const authMiddleware = require("../middlewares/authMiddleware");

//? login - POST api/v1/users/login
router.post("/login", authMiddleware.login, usersController.login);

//? register - POST api/v1/users/
router.post("/", usersController.register);

//? recover password - POST api/v1/users/password
router.post("/password", (req, res) => {
  // TODO

  res.send("Recover password");
});

//? delete user - DELETE api/v1/users/:user
router.delete("/:user", (req, res) => {
  // TODO

  res.send("delete user");
});

//? change password - PUT api/v1/users/password
router.put("/:user", (req, res) => {
  // TODO

  res.send("change password");
});

module.exports = router;
