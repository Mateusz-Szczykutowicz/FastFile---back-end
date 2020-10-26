const express = require("express");
const router = express.Router();

// [tmp] dostęp do bazy danych
const User = require("../model/User.js");
const config = require("../config");
const sha256 = require("sha256");

router.get("/", (req, res) => {
  res.send("auth");
});

router.post("/login", (req, res) => {
  let login, password;
  if (req.body["login"] != undefined) {
    login = req.body["login"].toLowerCase();
    password = sha256(req.body["password"] + config.passSalt);
  }

  User.findOne({ login: login, password: password }, (err, resp) => {
    if (err) {
      console.log("err :>> ", err); //! Error
      res
        .status(500)
        .send({ status: false, message: "Contact the technical department" });
    }
    if (resp !== null) {
      req.session["user"] = true;
      res.send({ status: true, message: "Logged in successfully" });
    } else {
      res.send({ status: false, message: "Wrong login or password" });
    }
  });
});

module.exports = router;
