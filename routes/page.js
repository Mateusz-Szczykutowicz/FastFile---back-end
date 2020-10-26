const express = require("express");
const router = express.Router();
const path = require("path");

// [tmp] Zmienna do katalogu publicznego
const public = path.join(__dirname, "../public");

router.get("/", (req, res) => {
  res.sendFile("/index.html", { root: public });
});

router.get("/register", (req, res) => {
  res.sendFile("/pages/register.html", { root: public });
});

router.get("/dashboard", (req, res) => {
  if (req.session["user"]) {
    res.sendFile("./pages/dashboard.html", { root: public });
  } else {
    res.redirect("/");
  }
});

module.exports = router;
