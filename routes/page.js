const express = require("express");
const router = express.Router();
const path = require("path");

// [tmp] Zmienna do katalogu publicznego
const public = path.join(__dirname, "../public");

router.get("/", (req, res) => {
  res.sendFile("/index.html", { root: public });
});

// router.get("/js/main-bundle", (req, res) => {
//   res.sendFile("/build/js/main.bundle.js", { root: public });
// });

module.exports = router;
