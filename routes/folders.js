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
const fs = require("fs");

//? Create one folder - POST api/v1/folders
router.post("/", authMiddleware.checkToken, folderController.user.create);

//? Get all files and folders in folder - GET api/v1/folders{?path=/folderName/subFolder}
router.get(
    "/",
    authMiddleware.checkToken,
    folderController.user.getAllFilesAndFolders
);

//? Delete one folder with child - DELETE api/v1/folders
router.delete("/", authMiddleware.checkToken, folderController.user.deleteOne);

//?

module.exports = router;
