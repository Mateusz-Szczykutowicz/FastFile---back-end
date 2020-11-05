const express = require("express");
const router = express.Router();
const fileController = require("../controllers/api/fileController.js");
const authMiddleware = require("../middlewares/authMiddleware.js");

// [tmp]
const fileMiddleware = require("../middlewares/fileMiddleware.js");
const File = require("../models/File.js");

//? Display all files - GET
router.get("/:user/", fileController.readAll);

//? Display one file - GET
router.get("/:user/:id", fileController.ReadOne);

//? Upload file - POST
router.post("/:user/", authMiddleware, fileController.Create);

//? Rename file - PUT
router.put("/:user/:id", fileController.updateOne);

//? Delete file - DELETE
router.delete("/:user/:id", fileController.deleteOne);

module.exports = router;
