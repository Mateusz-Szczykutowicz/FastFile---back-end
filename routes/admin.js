const express = require("express");
const router = express.Router();
const fileController = require("../controllers/api/fileController.js");
const authMiddleware = require("../middlewares/authMiddleware.js");
const usersController = require("../controllers/api/usersController.js");

// [tmp]
const fileMiddleware = require("../middlewares/fileMiddleware.js");
const File = require("../models/File.js");

//? Display all files as admin - GET api/v1/admin/file/:user
router.get(
  "/files/:user",
  authMiddleware.checkToken,
  authMiddleware.isAdmin,
  fileController.admin.readAll
);

//? Display one file as admin - GET api/v1/admin/file/:user/:id
router.get(
  "/files/:user/:id",
  authMiddleware.checkToken,
  authMiddleware.isAdmin,
  fileController.admin.readOne
);

//? Upload file as admin - POST api/v1/admin/file/:user
router.post(
  "/files/:user/",
  authMiddleware.checkToken,
  authMiddleware.isAdmin,
  fileController.admin.create
);

//? Rename file as admin - PUT api/v1/admin/file/:user/:id
router.put(
  "/files/:user/:id",
  authMiddleware.checkToken,
  authMiddleware.isAdmin,
  fileController.admin.updateOne
);

//? Delete file as admin - DELETE api/v1/admin/file/:user/:id
router.delete(
  "/files/:user/:id",
  authMiddleware.checkToken,
  authMiddleware.isAdmin,
  fileController.admin.deleteOne
);

//? get all users as admin - GET api/v1/admin/users/
router.get(
  "/users",
  authMiddleware.checkToken,
  authMiddleware.isAdmin,
  usersController.admin.getAll
);

//? get one user as admin - GET api/v1/admin/users/:user
router.get(
  "/users/:user",
  authMiddleware.checkToken,
  authMiddleware.isAdmin,
  usersController.admin.getOne
);

module.exports = router;
