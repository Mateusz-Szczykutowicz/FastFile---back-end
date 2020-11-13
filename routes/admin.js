const express = require("express");
const router = express.Router();
const fileController = require("../controllers/api/fileController.js");
const authMiddleware = require("../middlewares/authMiddleware.js");
const usersController = require("../controllers/api/usersController.js");

// [tmp]
const fileMiddleware = require("../middlewares/fileMiddleware.js");
const File = require("../models/File.js");
const User = require("../models/User.js");
const config = require("../config.js");
const sha256 = require("sha256");
const path = require("path");

//- Files

//? Display all files as admin - GET api/v1/admin/files/:user
router.get(
    "/files/:user",
    // authMiddleware.checkToken,
    // authMiddleware.isAdmin,
    fileController.admin.readAll
);

//? Display one file as admin - GET api/v1/admin/files/:user/:id
router.get(
    "/files/:user/:id",
    // authMiddleware.checkToken,
    // authMiddleware.isAdmin,
    fileController.admin.readOne
);

//? Upload file as admin - POST api/v1/admin/files/:user
router.post(
    "/files/:user/",
    // authMiddleware.checkToken,
    // authMiddleware.isAdmin,
    fileController.admin.create
);

//? Rename file as admin - PUT api/v1/admin/files/:user/:id
router.put(
    "/files/:user/:id",
    // authMiddleware.checkToken,
    // authMiddleware.isAdmin,
    fileController.admin.updateOne
);

//? Delete file as admin - DELETE api/v1/admin/files/:user/:id
router.delete(
    "/files/:user/:id",
    // authMiddleware.checkToken,
    // authMiddleware.isAdmin,
    fileController.admin.deleteOne
);

//? View image as admin - GET api/v1/admin/files/:user/:id/image
router.get(
    "/files/:user/:id/image",
    // authMiddleware.checkToken,
    // authMiddleware.isAdmin,
    fileController.admin.viewImage
);

//- USER

//? get all users as admin - GET api/v1/admin/users/
router.get(
    "/users",
    // authMiddleware.checkToken,
    // authMiddleware.isAdmin,
    usersController.admin.getAll
);

//? get one user as admin - GET api/v1/admin/users/:user
router.get(
    "/users/:user",
    // authMiddleware.checkToken,
    // authMiddleware.isAdmin,
    usersController.admin.getOne
);

//? change user password as admin - PUT api/v1/admin/users/:user
router.put(
    "/users/:user",
    // authMiddleware.checkToken,s
    // authMiddleware.isAdmin,
    usersController.admin.change_pasword
);

//? delete one user as admin - DELETE api/v1/admin/users/:user
router.delete(
    "/users/:user",
    // authMiddleware.checkToken,
    // authMiddleware.isAdmin,
    usersController.admin.deleteOne
);

//? get user role - GET api/v1/admin/users/:user/admin
router.get(
    "/users/:user/admin",
    // authMiddleware.checkToken,
    // authMiddleware.isAdmin,
    usersController.admin.getUserRole
);

//? add/remove role admin - PUT api/v1/admin/users/:user/admin
router.put(
    "/users/:user/admin",
    // authMiddleware.checkToken,
    // authMiddleware.isAdmin,
    usersController.admin.setUserRole
);

module.exports = router;
