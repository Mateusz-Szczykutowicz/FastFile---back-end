const express = require("express");
const router = express.Router();
const fileController = require("../controllers/api/fileController.js");
const authMiddleware = require("../middlewares/authMiddleware.js");

// [tmp]
const fileMiddleware = require("../middlewares/fileMiddleware.js");
const File = require("../models/File.js");

//? Display all files - GET
router.get("/:user", fileController.user.readAll);

//? Display one file - GET
router.get("/:user/:id", fileController.user.readOne);

//? Upload file - POST
router.post("/:user/", fileController.user.create);

//? Rename file - PUT
router.put("/:user/:id", fileController.user.updateOne);

//? Delete file - DELETE
router.delete("/:user/:id", fileController.user.deleteOne);

module.exports = router;
