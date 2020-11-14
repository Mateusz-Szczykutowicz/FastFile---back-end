const sha256 = require("sha256");
const User = require("../models/User");
const config = require("../config.js");

let tokens = {};

const logout = (token) => {
    token = token.split(".");
    let payload = token[0];
    tokens[payload] = undefined;
};

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
        let signature = sha256(`${this.user["_id"]}.${config.tokenSalt}`);
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
            password = sha256(`${password}${config.passwordSalt}`);
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
                .status(401)
                .send({ status: false, message: "Unauthorized access" });
        }
        let token = req.headers.authorization;
        token = token.split(".");
        let payload = token[0];
        let signature = token[1];
        if (!signature || !payload) {
            console.log("Signature or payload not exist");
            return res
                .status(401)
                .send({ status: false, message: "Unauthorized access" });
        }
        if (tokens[payload] == signature) {
            next();
        } else {
            return res
                .status(401)
                .send({ status: false, message: "Unauthorized access" });
        }
    },
    async isAdmin(req, res, next) {
        let token = req.headers.authorization.split(".");
        let signature = token[1];
        let admin = await User.findOne({ signature });
        if (!admin) {
            return res
                .status(403)
                .send({ status: false, message: "No permission!" });
        }
        if (admin.role === "admin" || admin.role === "superadmin") {
            return next();
        } else {
            return res
                .status(403)
                .send({ status: false, message: "No permission!" });
        }
    },
    logout,
};
