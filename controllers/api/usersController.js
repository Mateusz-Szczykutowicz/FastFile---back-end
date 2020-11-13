const User = require("../../models/User.js");
const sha256 = require("sha256");
const authMiddleware = require("../../middlewares/authMiddleware.js");
const config = require("../../config.js");
const path = require("path");
const fs = require("fs");
const File = require("../../models/File.js");
const Folder = require("../../models/Folder.js");

module.exports = {
    user: {
        async login(req, res) {
            let user = await User.findOne({ login: req.body.login });
            let myToken = new authMiddleware.Token(user, { expire: 15 });
            return res.status(200).send({
                status: true,
                message: "Login - success",
                token: myToken.createToken(),
            });
        },

        logout(req, res) {
            authMiddleware.logout(req.headers.authorization);
            res.status(200).send({ status: true, message: "Logout - success" });
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
                            return res.status(409).send({
                                status: false,
                                message: "This login already exists",
                            });
                        } else {
                            let user = new User({ login, password, email });
                            const folder = new Folder({
                                user: user.login,
                                parent: "root",
                            });
                            folder.save();
                            user.password = sha256(
                                `${password}${config.passwordSalt}`
                            );
                            user.signature = sha256(
                                `${user["_id"]}.${config.tokenSalt}`
                            );
                            user.salt = sha256(
                                `${user["_id"]}${Math.random()}.${config.salt}`
                            );
                            user.hash = sha256(
                                `${user["_id"]}.${config.hash}${Math.random()}`
                            );
                            user.save();
                            return res.status(201).send({
                                status: true,
                                message: "Register - success",
                            });
                        }
                    });
                } else {
                    return res.status(406).send({
                        status: false,
                        message: "One of the form fields is empty",
                    });
                }
            } else {
                return res.status(406).send({
                    status: false,
                    message: "One of the form fields is empty",
                });
            }
        },
        getInformation(req, res) {
            const token = req.headers.authorization.split(".");
            const signature = token[1];
            const user = User.findOne({ signature }, (err, resp) => {
                if (err) {
                    console.log(
                        "Error in get information about account :>> ",
                        err
                    );
                    return res.status(500).send({
                        status: false,
                        message: "Error! Contact the administrator!",
                    });
                }
                if (resp) {
                    const data = {
                        login: resp.login,
                        email: resp.email,
                        created: resp.createdAt,
                    };
                    return res.status(200).send({
                        status: true,
                        message: "Information about account",
                        data,
                    });
                } else {
                    return res
                        .status(404)
                        .send({ status: false, message: "User not found!" });
                }
            });
        },
        async changePasword(req, res) {
            if (!req.body) {
                return res
                    .status(409)
                    .send({ status: false, message: "Body is empty!" });
            }
            if (req.body.password === "") {
                return res.status(409).send({
                    status: false,
                    message: "Password field is empty!",
                });
            }
            let password = sha256(`${req.body.password}${config.passwordSalt}`);
            let token = req.headers.authorization.split(".");
            let signature = token[1];

            let user = await User.findOne({ signature });
            if (user.password === password) {
                return res.status(409).send({
                    status: false,
                    message: "Passwords are the same!",
                });
            }
            user.password = password;
            user.save()
                .then(() => {
                    authMiddleware.logout(req.headers.authorization);
                    return res
                        .status(200)
                        .send({ status: true, message: "Password changed" });
                })
                .catch((err) => {
                    if (err) {
                        console.log("Error in change password :>>", err);
                        return res.status(500).send({
                            status: false,
                            message: "Error! Contact the administrator",
                        });
                    }
                });
        },
        deleteAccount(req, res) {
            const token = req.headers.authorization.split(".");
            const signature = token[1];
            User.findOneAndDelete({ signature }, async (err, resp) => {
                if (err) {
                    console.log("Error in user delete one :>> ", err);
                    return res.status(500).send({
                        status: false,
                        message: "Error! Contact the administator",
                    });
                }
                if (resp) {
                    const userPath = path.join(
                        __dirname,
                        `../../uploads/${resp.login}`
                    );
                    fs.rmdir(
                        userPath,
                        { maxRetries: 2, recursive: true },
                        (err) => {
                            if (err) {
                                console.log(
                                    "Error in delete account - fs :>> ",
                                    err
                                );
                            }
                        }
                    );
                    File.deleteMany({ user: resp.login }, (err) => {
                        if (err) {
                            console.log(
                                "Error in delete account - remove files in DB :>> ",
                                err
                            );
                        }
                    });
                    authMiddleware.logout(req.headers.authorization);
                    return res
                        .status(200)
                        .send({ status: true, message: "Account deleted" });
                } else {
                    return res
                        .status(404)
                        .send({ status: false, message: "User not found!" });
                }
            });
        },
    },
    admin: {
        async getAll(req, res) {
            User.find({}, (err, resp) => {
                if (err) {
                    return res.status(500).send({
                        status: false,
                        message: "Error! Contact the administrator",
                    });
                }
                if (resp[0]) {
                    const users = [];
                    let counter = 0;
                    for (let el of resp) {
                        users.push(el.login);
                        counter++;
                    }
                    return res.status(200).send({
                        status: true,
                        message: `Found ${counter} users`,
                        users,
                    });
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
                    return res.status(500).send({
                        status: false,
                        message: "Error! Contact the administrator",
                    });
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

        async deleteOne(req, res) {
            let login = req.params.user;
            let user = await User.findOne({ login });
            if (!user) {
                return res
                    .status(404)
                    .send({ status: false, message: `User not found` });
            }
            if (user.role === "admin" || user.role === "superadmin") {
                return res
                    .status(403)
                    .send({ status: false, message: "No permission!" });
            }
            user.deleteOne((err, resp) => {
                if (err) {
                    console.log("Error in delete user as admin :>> ", err);
                }
                const userPath = path.join(
                    __dirname,
                    `../../uploads/${resp.login}`
                );
                fs.rmdir(
                    userPath,
                    { maxRetries: 2, recursive: true },
                    (err) => {
                        if (err) {
                            console.log(
                                "Error in delete account - fs :>> ",
                                err
                            );
                        }
                    }
                );
                File.deleteMany({ user: resp.login }, (err) => {
                    if (err) {
                        console.log(
                            "Error in delete account - remove files in DB :>> ",
                            err
                        );
                    }
                });
                Folder.deleteMany({ user: resp.login }, (err) => {
                    if (err) {
                        console.log(
                            "Error in delete account - remove files in DB :>> ",
                            err
                        );
                    }
                });
                return res.status(200).send({
                    status: true,
                    message: `User ${login} deleted`,
                });
            });
        },

        async change_pasword(req, res) {
            if (!req.body) {
                return res
                    .status(409)
                    .send({ status: false, message: "Body is empty!" });
            }
            if (req.body.password === "") {
                return res.status(409).send({
                    status: false,
                    message: "Password field is empty!",
                });
            }
            const password = sha256(
                `${req.body.password}${config.passwordSalt}`
            );
            const login = req.params.user;
            const user = await User.findOne({ login });
            if (!user) {
                return res
                    .status(404)
                    .send({ status: false, message: "User not found!" });
            }
            if (user.password === password) {
                return res.status(409).send({
                    status: false,
                    message: "Passwords are the same!",
                });
            }
            user.password = password;
            user.save().then(() => {
                return res.status(200).send({
                    status: true,
                    message: `${user.login}'s password updated`,
                });
            });
        },
        async setUserRole(req, res) {
            const token = req.headers.authorization.split(".");
            const signature = token[1];
            const superAdmin = await User.findOne({ signature });
            if (superAdmin.role !== "superadmin") {
                return res
                    .status(403)
                    .send({ status: false, message: "No permission!" });
            }
            const login = req.params.user;
            const user = await User.findOne({ login });
            if (!user) {
                return res
                    .status(404)
                    .send({ status: false, message: "User not found!" });
            }
            if (user.role == "admin") {
                user.role = "user";
                user.save().then(() => {
                    return res.status(200).send({
                        status: true,
                        message: "Removed admin - success",
                    });
                });
            } else if (user.role == "user") {
                user.role = "admin";
                user.save().then(() => {
                    return res.status(200).send({
                        status: true,
                        message: "Added new admin - success",
                    });
                });
            } else {
                return res
                    .status(403)
                    .send({ status: false, message: "No permission!" });
            }
        },
        async getUserRole(req, res) {
            const login = req.params.user;
            let user = await User.findOne({ login });
            if (!user) {
                return res
                    .status(404)
                    .send({ status: false, message: "User not found!" });
            }
            let role = user.role;
            return res.status(200).send({
                status: true,
                message: "Successed",
                user: { user: login, role },
            });
        },
    },
};
