const sha256 = require("sha256");
const User = require("../models/User");

let tokens = {};

class Token {
  constructor(user, { expire }) {
    this.token = ``;
    this.expire = expire * 1000 * 60;
    this.user = user;
  }
  createToken() {
    let randomize = Math.random();
    let payload = sha256(
      `${this.user.salt}${randomize * Math.random()}${this.user.hash}`
    );
    let signature = sha256(`${this.user["_id"]}`);
    this.token = `${payload}.${signature}`;
    tokens[payload] = signature;
    setTimeout(() => {
      tokens[payload] = undefined;
    }, this.expire);
    return this.token;
  }
}

module.exports = {
  async login(req, res, next) {
    let login, password;
    if (req.body) {
      login = req.body.login || "";
      password = req.body.password || "";
      password = sha256(password);
    }

    let user = await User.findOne({ login, password });
    if (user) {
      return next();
    } else {
      return res
        .status(401)
        .send({ status: false, message: "Wrong login or password" });
    }
  },
  Token,
  checkToken(req, res, next) {
    if (!req.headers.authorization) {
      console.log("Blank header - authorization");
      return res
        .status(500)
        .send({ status: false, message: "Error! Contact the admin" });
    }
    let token = req.headers.authorization;
    token = token.split(".");
    let payload = token[0];
    let signature = token[1];
    if (tokens[payload] == signature) {
      next();
    } else {
      res.status(401).send({ status: false, message: "Unauthorized access" });
    }
  },
};
