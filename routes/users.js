const express = require("express");
const router = express.Router();
const usersController = require("../controllers/api/usersController.js");

// [tmp]
const User = require("../models/User.js");
const sha256 = require("sha256");
const authMiddleware = require("../middlewares/authMiddleware");
const config = require("../config.js");
const userMiddleware = require("../middlewares/userMiddleware.js");

//? login - POST api/v1/users/login
router.post("/login", authMiddleware.login, usersController.user.login);

//? logout - POST api/v1/users/logout
router.get("/logout", authMiddleware.checkToken, usersController.user.logout);

//? register - POST api/v1/users/
router.post("/", usersController.user.register);

//? recover password - POST api/v1/users/password
router.post("/recover", usersController.user.recoverPassword);

router.put(
    "/recover",
    userMiddleware.checkRecoverToken,
    usersController.user.changePasword
);

//? get information about account - GET api/v1/users
router.get("/", authMiddleware.checkToken, usersController.user.getInformation);

//? delete account - DELETE api/v1/users/
router.delete(
    "/",
    authMiddleware.checkToken,
    usersController.user.deleteAccount
);

//? change password - PUT api/v1/users/password
router.put(
    "/password",
    authMiddleware.checkToken,
    usersController.user.changePasword
);

module.exports = router;
