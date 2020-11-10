const File = require("../../models/File.js");
const fileMiddleware = require("../../middlewares/fileMiddleware.js");
const userMiddleware = require("../../middlewares/userMiddleware.js");

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
                    for (let el of resp) {
                        data.push({
                            user: el.user,
                            slug: el.slug,
                            name: el.name,
                            size: el.size,
                            type: el.mimetype,
                            path: el.url,
                        });
                    }
                    return res.status(200).send({
                        status: true,
                        message: "Files found!",
                        data: data,
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
        create(req, res) {
            if (!req.files) {
                return res
                    .status(409)
                    .send({ status: false, message: "File not attached!" });
            }
            let user = req.params.user || "undefined";
            let file = req.files.upload;
            let path = req.body.path || "/";
            let url = `${path}`;
            let uri = `${user}/${url}/${file.name}`;
            let { name, size, mimetype } = file;
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
        async deleteOne(req, res) {
            const user = req.params.user;
            const slug = req.params.id;
            let removed = await File.deleteOne({ user, slug }, (err) => {
                if (err) {
                    return res.status(500).send({
                        status: false,
                        message: "Error! Contact the administrator",
                    });
                }
            });
            if (removed.deletedCount == 1) {
                return res
                    .status(200)
                    .send({ status: true, message: `File ${slug} deleted` });
            } else {
                return res
                    .status(404)
                    .send({ status: false, message: `File not found!` });
            }
        },
        async updateOne(req, res) {
            const user = req.params.user;
            const slug = req.params.id;
            const newName = req.body.name;
            const file = await File.findOne({ user, slug });
            if (file == null) {
                return res
                    .status(404)
                    .send({ status: false, message: "File not found!" });
            }
            file.name = newName;
            file.save().then((resp) => {
                let { slug, name } = resp;
                res.status(200).send({
                    status: true,
                    message: "Updated one file",
                    data: { slug, name },
                });
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
                        status: false,
                        message: `Found file`,
                        file: data,
                    });
                } else {
                    return res
                        .status(200)
                        .send({ status: false, message: "Files not found!" });
                }
            });
        },
        create(req, res) {},
        updateOne(req, res) {},
        deleteOne(req, res) {},
    },
};
