const express = require("express");
const router = express.Router();
const fileController = require("../controllers/api/fileController.js");
const authMiddleware = require("../middlewares/authMiddleware.js");

// [tmp]
const fileMiddleware = require("../middlewares/fileMiddleware.js");
const userMiddleware = require("../middlewares/userMiddleware.js");
const File = require("../models/File.js");
const User = require("../models/User.js");
const path = require("path");

//? Display all files - GET api/v1/file/
router.get("/", authMiddleware.checkToken, fileController.user.readAll);

//? Display one file - GET api/v1/file/:id
router.get("/:id", authMiddleware.checkToken, fileController.user.readOne);

//? Upload file - POST api/v1/file/
router.post("/", authMiddleware.checkToken, fileController.user.create);

//? Rename file - PUT api/v1/file/:id
router.put("/:id", fileController.user.updateOne);

//? Delete file - DELETE api/v1/file/:id
router.delete("/:id", authMiddleware.checkToken, fileController.user.deleteOne);

//? Download file - GET api/v1/file/:id/download
router.get(
    "/:id/download",
    authMiddleware.checkToken,
    fileController.user.download
);

module.exports = router;
