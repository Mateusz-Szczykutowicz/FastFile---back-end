const User = require("../../models/User.js");
const jwt = require("jsonwebtoken");

module.exports = {
  login(req, res) {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: 1200,
    });
    return res.send({ status: true, message: "success", token });
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
            await User.register(user, password);
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

  getAll(req, res) {
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

  getOne(req, res) {
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
