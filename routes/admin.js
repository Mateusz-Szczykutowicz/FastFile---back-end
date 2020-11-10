const express = require("express");
const router = express.Router();
const fileController = require("../controllers/api/fileController.js");
const authMiddleware = require("../middlewares/authMiddleware.js");
const usersController = require("../controllers/api/usersController.js");

// [tmp]
const fileMiddleware = require("../middlewares/fileMiddleware.js");
const File = require("../models/File.js");

//? Display all files - GET
router.get(
  "/files/:user",
  authMiddleware.checkToken,
  authMiddleware.isAdmin,
  fileController.admin.readAll
);

//? Display one file - GET
router.get(
  "/files/:user/:id",
  authMiddleware.checkToken,
  authMiddleware.isAdmin,
  fileController.admin.readOne
);

//? Upload file - POST
router.post(
  "/files/:user/",
  authMiddleware.checkToken,
  authMiddleware.isAdmin,
  fileController.admin.create
);

//? Rename file - PUT
router.put(
  "/files/:user/:id",
  authMiddleware.checkToken,
  authMiddleware.isAdmin,
  fileController.admin.updateOne
);

//? Delete file - DELETE
router.delete(
  "/files/:user/:id",
  authMiddleware.checkToken,
  authMiddleware.isAdmin,
  fileController.admin.deleteOne
);

//? get all users - GET api/v1/admin/users/
router.get(
  "/users",
  authMiddleware.checkToken,
  authMiddleware.isAdmin,
  usersController.getAll
);

//? get one user - GET api/v1/admin/users/:user
router.get(
  "/users/:user",
  authMiddleware.checkToken,
  authMiddleware.isAdmin,
  usersController.getOne
);

module.exports = router;
