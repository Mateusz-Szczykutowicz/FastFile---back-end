const User = require("../../models/User.js");
const sha256 = require("sha256");
const authMiddleware = require("../../middlewares/authMiddleware.js");
const config = require("../../config.js");

module.exports = {
  async login(req, res) {
    let user = await User.findOne({ login: req.body.login });
    let myToken = new authMiddleware.Token(user, { expire: 5 });
    return res.status(200).send({
      status: true,
      message: "Login - success",
      token: myToken.createToken(),
    });
  },

  register(req, res) {
    if (req.body) {
      const { login, password, email } = req.body;
      if (login && password && email) {
        User.findOne({ login }, async (err, resp) => {
          if (err) {
            return res.status(500).send({
              status: false,
              message: "Error! Contact the administrator",
            });
          }
          if (resp) {
            return res
              .status(406)
              .send({ status: false, message: "This login already exists" });
          } else {
            let user = new User({ login, password, email });
            user.password = sha256(password);
            user.signature = sha256(`${user["_id"]}.${config.tokenSalt}`);
            user.salt = sha256(`${user["_id"]}${Math.random()}.${config.salt}`);
            user.hash = sha256(`${user["_id"]}.${config.hash}${Math.random()}`);
            user.save();
            return res
              .status(201)
              .send({ status: true, message: "Register - success" });
          }
        });
      } else {
        return res
          .status(409)
          .send({ status: false, message: "One of the form fields is empty" });
      }
    } else {
      return res
        .status(409)
        .send({ status: false, message: "One of the form fields is empty" });
    }
  },

  async getAll(req, res) {
    User.find({}, (err, resp) => {
      if (err) {
        return res
          .status(500)
          .send({ status: false, message: "Error! Contact the administrator" });
      }
      if (resp[0]) {
        const users = [];
        let counter = 0;
        for (let el of resp) {
          users.push(el.login);
          counter++;
        }
        return res
          .status(200)
          .send({ status: true, message: `Found ${counter} users`, users });
      } else {
        return res
          .status(404)
          .send({ status: false, message: "Not found users!" });
      }
    });
  },

  async getOne(req, res) {
    const login = req.params.user.toLowerCase();
    User.findOne({ login }, (err, resp) => {
      if (err) {
        return res
          .status(500)
          .send({ status: false, message: "Error! Contact the administrator" });
      }
      if (resp) {
        let data = {
          login: resp.login,
          email: resp.email,
          created: resp.createdAt,
        };
        return res.status(200).send({
          status: true,
          message: `Found user ${resp.login}`,
          data,
        });
      } else {
        return res
          .status(404)
          .send({ status: false, message: "User not found" });
      }
    });
  },

  deleteOne(req, res) {},

  change_pasword(req, res) {},
};
