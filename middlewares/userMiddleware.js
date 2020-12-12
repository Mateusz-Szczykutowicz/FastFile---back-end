const User = require("../models/User");
const sha256 = require("sha256");
const config = require("../config.js");
const nodemailer = require("nodemailer");

let myMail = nodemailer.createTransport({
    host: config.nodeMail.host,
    port: config.nodeMail.port,
    secure: false, // upgrade later with STARTTLS
    auth: {
        user: config.nodeMail.login,
        pass: config.nodeMail.password,
    },
    tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false,
    },
});

const RecoverToken = {
    tokens: [],
    setRecoverToken(user) {
        const token = sha256(
            `${config.recoverTokenSalt}-${user.signature}.${Math.random()}`
        );
        this.tokens.push(token);
        setTimeout(() => {
            const indexOfToken = this.tokens.indexOf(token);
            this.tokens.splice(indexOfToken, 1);
        }, 1000 * 60 * 15);
        return token;
    },
    getTokens() {
        return this.tokens;
    },
};

let sendRecoverMail = (user, token) => {
    const message = {
        from: "DeltaStorm <noreplay@deltastorm.pl>",
        to: `${user.email}`,
        subject: "Recover password",
        html: `
        <html>
        <body>
        <h4>Hello <span style="text-transform : capitalize;">${user.login}</span></h4>
        <p>Recover your password - open link and change your password</p><br/>
        <a href="http://localhost/api/v1/password/${token}">Change password</a>
        </body>
        </html>
        `,
    };
    console.log(user.email);
    myMail.sendMail(message, (error) => {
        if (error) {
            return console.log(error);
        }
        return true;
    });
};

module.exports = {
    async getUser(token) {
        if (!token) {
            return false;
        }
        token = token.split(".");
        let signature = token[1];
        let user = await User.findOne({ signature });
        return user;
    },
    checkRecoverToken(req, res, next) {
        const tokens = RecoverToken.getTokens();
        if (!req.headers.authorization) {
            return res
                .status(406)
                .send({ status: false, message: "Token is empty" });
        }
        let token = req.headers.authorization.split(".");
        token = token[0];
        if (tokens.indexOf(token) !== -1) {
            return next();
        } else {
            return res
                .status(404)
                .send({ status: false, message: "Wrong token" });
        }
    },
    RecoverToken,
    sendRecoverMail,
};
