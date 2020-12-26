const File = require("../../models/File.js");
const fileMiddleware = require("../../middlewares/fileMiddleware.js");
const userMiddleware = require("../../middlewares/userMiddleware.js");
const User = require("../../models/User.js");
const fs = require("fs");
const path = require("path");
const Folder = require("../../models/Folder.js");

module.exports = {
    admin: {
        readAll(req, res) {
            let user = req.params.user;
            File.find({ user }, (err, resp) => {
                if (err) {
                    return res.status(500).send({
                        status: false,
                        message: "Error! Contact the administrator",
                    });
                }
                if (resp[0]) {
                    let data = [];
                    let filesCounter = 0;
                    for (let el of resp) {
                        data.push({
                            user: el.user,
                            slug: el.slug,
                            name: el.name,
                            size: el.size,
                            type: el.mimetype,
                            path: el.url,
                        });
                        filesCounter++;
                    }
                    return res.status(200).send({
                        status: true,
                        message: `Found ${filesCounter} files`,
                        files: data,
                    });
                } else {
                    return res
                        .status(404)
                        .send({ status: true, message: "Files not found!" });
                }
            });
        },
        readOne(req, res) {
            const user = req.params.user;
            const slug = req.params.id;
            File.findOne({ user, slug }, (err, resp) => {
                if (err) {
                    return res.status(500).send({
                        status: false,
                        message: "Error! Contact the administrator",
                    });
                }
                if (resp) {
                    let size = resp.size;
                    let type = resp.mimetype;
                    let url = resp.url;
                    return res.status(200).send({
                        status: true,
                        message: "Found one file",
                        data: { user, slug, size, type, url },
                    });
                } else {
                    return res
                        .status(404)
                        .send({ status: false, message: "File not found!" });
                }
            });
        },
        async create(req, res) {
            if (!req.files) {
                return res
                    .status(409)
                    .send({ status: false, message: "File not attached!" });
            }
            let user = req.params.user || "undefined";
            let userInDB = await User.findOne({ login: user });
            if (!userInDB) {
                return res
                    .status(404)
                    .send({ status: false, message: "User not found" });
            }
            let file = req.files.upload;
            let path = req.body.path || "";
            let url = `${path}`;
            let uri = `${user}/${path}/${file.name}`;
            let { name, size, mimetype } = file;
            const myFile = new File({ user, name, size, mimetype, url });
            const folder = await Folder.findOne({ path, user });
            if (!folder) {
                return res
                    .status(406)
                    .send({ status: false, message: "Folder not exist" });
            }
            File.findOne({ user, name, url }, (err, resp) => {
                if (err) {
                    console.log("Error in File.findOne: " + err);
                    return res.status(500).send({
                        status: false,
                        message: "Error! Contact the administrator",
                    });
                }
                if (resp) {
                    return res.status(409).send({
                        status: false,
                        message: "This file already exists",
                    });
                } else {
                    if (file.size < 6 * 1024 * 1024) {
                        if (fileMiddleware.save(file, uri, user)) {
                            myFile.save();
                            return res.status(201).send({
                                status: true,
                                message: "Upload - success",
                            });
                        } else {
                            return res.status(500).send({
                                status: false,
                                message: "Error! Contact the administrator",
                            });
                        }
                    } else {
                        return res.status(406).send({
                            status: false,
                            message: "The file is too large",
                        });
                    }
                }
            });
        },
        deleteOne(req, res) {
            const user = req.params.user;
            const slug = req.params.id;
            File.findOneAndRemove({ user, slug }, (err, resp) => {
                if (err) {
                    console.log("err :>> ", err);
                    return res.status(500).send({
                        status: false,
                        message: "Error! Contact the administrator",
                    });
                }

                if (resp) {
                    let filePath = path.join(
                        __dirname,
                        `../../uploads/${user}/root${resp.url}/${resp.name}`
                    );
                    fs.unlink(filePath, (err) => {
                        if (err) {
                            console.log(err);
                        }
                    });
                    return res.status(200).send({
                        status: true,
                        message: `File ${slug} deleted`,
                    });
                } else {
                    return res
                        .status(404)
                        .send({ status: false, message: `File not found!` });
                }
            });
        },
        async updateOne(req, res) {
            const user = req.params.user;
            const slug = req.params.id;
            const newName = req.body.name;
            const file = await File.findOne({ user, slug });
            if (!file) {
                return res
                    .status(404)
                    .send({ status: false, message: "File not found!" });
            }
            const oldPath = path.join(
                __dirname,
                `../../uploads/${user}/root${file.url}/${file.name}`
            );
            let fileName = file.name.split(".");
            fileNewName = `${newName}.${fileName[fileName.length - 1]}`;
            file.name = fileNewName;
            file.save().then((resp) => {
                const { slug, name } = resp;
                const newPath = path.join(
                    __dirname,
                    `../../uploads/${user}/root${resp.url}/${resp.name}`
                );
                fs.rename(oldPath, newPath, (err) => {
                    if (err) {
                        console.log("Error in renameOne - admin :>> ", err);
                    }
                });
                res.status(200).send({
                    status: true,
                    message: "Updated one file",
                    data: { slug, name },
                });
            });
        },
        viewImage(req, res) {
            const user = req.params.user;
            const slug = req.params.id;
            File.findOne({ user, slug }, (err, resp) => {
                if (err) {
                    console.log("Error in view image :>> ", err);
                    return res.status(500).send({
                        status: false,
                        message: "Error! Contact the administrator",
                    });
                }
                if (resp) {
                    const type = resp.mimetype.split("/");
                    if (type[0] !== "image") {
                        return res.status(406).send({
                            status: false,
                            message: "File is not an image",
                        });
                    }
                    const filePath = path.join(
                        __dirname,
                        `../../uploads/${user}/root${resp.url}/${resp.name}`
                    );
                    return res.status(200).sendFile(filePath);
                } else {
                    return res
                        .status(404)
                        .send({ status: false, message: "File not found!" });
                }
            });
        },
    },
    user: {
        async readAll(req, res) {
            let user = userMiddleware.getUser(req.headers.authorization);
            let login;
            await user
                .then((resp) => {
                    login = resp.login;
                })
                .catch((err) => {
                    console.log("error in display all files :>> ", err);
                    res.status(500).send({
                        status: false,
                        message: "Error! Contact the administrator",
                    });
                });
            File.find({ user: login }, (err, resp) => {
                if (err) {
                    return res.status(500).send({
                        status: false,
                        message: "Error! Contact the administrator",
                    });
                }
                if (resp[0]) {
                    let files = [];
                    let filesCounter = 0;
                    for (let el of resp) {
                        let data = {
                            user: el.user,
                            slug: el.slug,
                            name: el.name,
                            type: el.mimetype,
                            url: el.url,
                        };
                        files.push(data);
                        filesCounter++;
                    }
                    return res.status(200).send({
                        status: false,
                        message: `Found ${filesCounter} files`,
                        files,
                    });
                } else {
                    return res
                        .status(200)
                        .send({ status: false, message: "Files not found!" });
                }
            });
        },
        async readOne(req, res) {
            let user = userMiddleware.getUser(req.headers.authorization);
            let login;
            await user
                .then((resp) => {
                    login = resp.login;
                })
                .catch((err) => {
                    console.log("error in display all files :>> ", err);
                    res.status(500).send({
                        status: false,
                        message: "Error! Contact the administrator",
                    });
                });
            File.find({ user: login, slug: req.params.id }, (err, resp) => {
                if (err) {
                    return res.status(500).send({
                        status: false,
                        message: "Error! Contact the administrator",
                    });
                }
                if (resp[0]) {
                    let data = {
                        slug: resp[0].slug,
                        user: resp[0].user,
                        name: resp[0].name,
                        size: resp[0].size,
                        type: resp[0].mimetype,
                        url: resp[0].url,
                        created: resp[0].createdAt,
                        modified: resp[0].updatedAt,
                    };
                    return res.status(200).send({
                        status: true,
                        message: `Found file`,
                        file: data,
                    });
                } else {
                    return res
                        .status(200)
                        .send({ status: false, message: "File not found!" });
                }
            });
        },
        async create(req, res) {
            if (!req.files) {
                return res
                    .status(409)
                    .send({ status: false, message: "File not attached!" });
            }
            let token = req.headers.authorization;
            token = token.split(".");
            let signature = token[1];
            let userName = await User.findOne({ signature });
            let user = userName.login;
            let file = req.files.upload;
            let path = req.body.path || "";
            let url = `${path}`;
            let uri = `${user}/root/${path}/${file.name}`;
            let { name, size, mimetype } = file;
            const folder = await Folder.findOne({ path, user });
            if (!folder) {
                return res
                    .status(406)
                    .send({ status: false, message: "Folder not exist" });
            }
            const myFile = new File({ user, name, size, mimetype, url });
            File.findOne({ user, name, url }, (err, resp) => {
                if (err) {
                    console.log("Error in File.findOne: " + err);
                    return res.status(500).send({
                        status: false,
                        message: "Error! Contact the administrator",
                    });
                }
                if (resp) {
                    return res.status(409).send({
                        status: false,
                        message: "This file already exists",
                    });
                } else {
                    if (file.size < 6 * 1024 * 1024) {
                        if (fileMiddleware.save(file, uri)) {
                            myFile.save();
                            return res.status(201).send({
                                status: true,
                                message: "Upload - success",
                            });
                        } else {
                            return res.status(500).send({
                                status: false,
                                message: "Error! Contact the administrator",
                            });
                        }
                    } else {
                        return res.status(406).send({
                            status: false,
                            message: "The file is too large",
                        });
                    }
                }
            });
        },
        async updateOne(req, res) {
            if (!req.body) {
                console.log("Error! Body is empty in update one");
                return res.status(500).send({
                    status: false,
                    message: "Error! Contact the administrator",
                });
            }
            let token = req.headers.authorization.split(".");
            let signature = token[1];
            let user = await User.findOne({ signature });
            let userName = user.login;
            let slug = req.params.id;
            let newName = req.body.name || "undefined";
            let file = await File.findOne({ user: userName, slug });
            if (!file) {
                return res
                    .status(404)
                    .send({ status: false, message: "File not found!" });
            }
            const oldPath = path.join(
                __dirname,
                `../../uploads/${user.login}/root${file.url}/${file.name}`
            );
            let type = file.name.split(".");
            file.name = `${newName}.${type[1]}`;
            const newPath = path.join(
                __dirname,
                `../../uploads/${user.login}/root${file.url}/${file.name}`
            );
            console.log("oldPath :>> ", oldPath);
            console.log("newPath :>> ", newPath);
            file.save().then((err) => {
                fs.rename(oldPath, newPath, (err) => {
                    if (err) {
                        console.log("Error in update one :>> ", err);
                    }
                });
                return res
                    .status(201)
                    .send({ status: true, message: "File updated - success" });
            });
        },
        async deleteOne(req, res) {
            let slug = req.params.id;
            let token = req.headers.authorization.split(".");
            let signature = token[1];
            let user = await User.findOne({ signature });
            let login = user.login;
            File.findOneAndRemove({ user: login, slug }, (err, resp) => {
                if (err) {
                    console.log("Error in user delete one :>> ", err);
                    return res.status(500).send({
                        status: false,
                        message: "Error! Contact the administrator",
                    });
                }
                if (resp) {
                    let filePath = path.join(
                        __dirname,
                        `../../uploads/${login}/root${resp.url}/${resp.name}`
                    );
                    fs.unlink(filePath, (err) => {
                        if (err) {
                            console.log("Error in file download fs :>> ", err);
                        }
                    });
                    return res.status(200).send({
                        status: true,
                        message: "File deleted",
                        file: resp.name,
                    });
                } else {
                    return res
                        .status(404)
                        .send({ status: false, message: "File not found" });
                }
            });
        },
        async download(req, res) {
            let token = req.headers.authorization.split(".");
            let signature = token[1];
            let user = await User.findOne({ signature });
            let userName = user.login;
            let slug = req.params.id;
            let file = await File.findOne({ user: userName, slug });
            if (!file) {
                return res
                    .status(404)
                    .send({ status: false, message: "File not found!" });
            }
            const filePath = path.join(
                __dirname,
                `../../uploads/${userName}/root${file.url}/${file.name}`
            );
            res.status(200).download(filePath, (err) => {
                if (err) {
                    console.log("Error in download one :>> ", err);
                }
            });
        },
        async viewImage(req, res) {
            let width = req.query.width ? req.query.width * 1 : undefined;
            let height = req.query.height ? req.query.height * 1 : undefined;
            const slug = req.params.id;
            const token = req.headers.authorization.split(".");
            const signature = token[1];
            const user = await User.findOne({ signature });
            const login = user.login;
            File.findOne({ user: login, slug }, async (err, resp) => {
                if (err) {
                    console.log("Error in view image :>> ", err);
                    return res.status(500).send({
                        status: false,
                        message: "Error! Contact the administrator",
                    });
                }
                if (resp) {
                    const type = resp.mimetype.split("/");
                    if (type[0] !== "image") {
                        return res.status(406).send({
                            status: false,
                            message: "File is not an image",
                        });
                    }
                    const filePath = path.join(
                        __dirname,
                        `../../uploads/${login}/root${resp.url}/${resp.name}`
                    );
                    console.log(filePath);
                    const resizedFile = await fileMiddleware.resizeImage(
                        filePath,
                        login,
                        resp.name,
                        { width, height }
                    );
                    return res.status(200).sendFile(resizedFile);
                } else {
                    return res
                        .status(404)
                        .send({ status: false, message: "File not found!" });
                }
            });
        },
    },
};
