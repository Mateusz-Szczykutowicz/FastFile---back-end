const express = require("express");
const router = express.Router();
const fileController = require("../controllers/api/fileController.js");
const authMiddleware = require("../middlewares/authMiddleware.js");
const usersController = require("../controllers/api/usersController.js");
const folderController = require("../controllers/api/folderController.js");

// [tmp]
const fileMiddleware = require("../middlewares/fileMiddleware.js");
const File = require("../models/File.js");
const User = require("../models/User.js");
const config = require("../config.js");
const sha256 = require("sha256");
const path = require("path");
const Folder = require("../models/Folder.js");

//? Create one folder - POST api/v1/folders
router.post("/", folderController.user.create);

//? Get all files in folder - GET api/v1/folders?path=img
router.get("/", folderController.user.getAllFilesAndFolders);

module.exports = router;
