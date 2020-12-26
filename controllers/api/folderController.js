const User = require("../../models/User.js");
const File = require("../../models/File.js");
const Folder = require("../../models/Folder.js");
const path = require("path");
const fs = require("fs");

module.exports = {
    admin: {},
    user: {
        async getAllFilesAndFolders(req, res) {
            let folderPath = "";
            let parentPath = "";
            if (req.query) {
                folderPath = req.query.path || "";
            }
            let pathArray = folderPath.split("/");
            for (let i = 1; i < pathArray.length - 1; i++) {
                parentPath += `/${pathArray[i]}`;
            }

            const token = req.headers.authorization.split(".");
            const signature = token[1];
            const user = await User.findOne({ signature });
            const login = user.login;
            const folder = await Folder.findOne({
                user: login,
                path: folderPath,
            });
            if (!folder) {
                return res
                    .status(404)
                    .send({ status: false, message: "Folder not found!" });
            }

            const folders = await Folder.find(
                {
                    parent: folderPath,
                    user: login,
                },
                "name user path createdAt updatedAt"
            );

            File.find(
                { user: login, url: folderPath },
                "slug name user size type path createdAt updatedAt",
                (err, resp) => {
                    if (err) {
                        return res.status(500).send({
                            status: false,
                            message: "Error! Contact the administrator",
                        });
                    }
                    if (resp) {
                        return res.status(200).send({
                            status: true,
                            message: `Found ${resp.length} files and ${folders.length} folders`,
                            parentPath,
                            resp,
                            folders,
                        });
                    } else {
                        return res.status(404).send({
                            status: false,
                            message: "Files not found!",
                            files: [],
                        });
                    }
                }
            );
        },
        async create(req, res) {
            if (!req.body) {
                return res
                    .status(409)
                    .send({ status: false, message: "Body is empty" });
            }
            if (!req.body.name) {
                return res
                    .status(409)
                    .send({ status: false, message: "Name field is empty" });
            }
            const token = req.headers.authorization.split(".");
            const signature = token[1];
            const user = await User.findOne({ signature });
            const parentPath = req.body.parentPath;
            const name = req.body.name.replace("/", "-");
            const folderPath = `${parentPath}/${name}`;
            Folder.findOne(
                { user: user.login, path: folderPath },
                async (err, resp) => {
                    if (err) {
                        return res.status(500).send({
                            status: false,
                            message: "Error! Contact the administrator",
                        });
                    }
                    if (resp) {
                        return res.status(409).send({
                            status: false,
                            message: "Folder already exist",
                        });
                    } else {
                        const parent = await Folder.findOne({
                            path: parentPath,
                        });
                        if (!parent) {
                            return res.status(406).send({
                                status: false,
                                message: "Parent folder not exist!",
                            });
                        }
                        const folder = new Folder({
                            name,
                            parent: parentPath,
                            path: folderPath,
                            user: user.login,
                        });
                        parent.save();
                        folder.save();
                        return res
                            .status(201)
                            .send({ status: true, message: "Folder created" });
                    }
                }
            );
        },
        async deleteOne(req, res) {
            if (!req.body) {
                return res
                    .status(406)
                    .send({ status: false, message: "Body is empty" });
            }
            const folderPath = req.body.path || "/";
            const token = req.headers.authorization.split(".");
            const signature = token[1];
            const user = await User.findOne({ signature });
            const login = user.login;

            const folder = await Folder.findOne({
                user: login,
                path: folderPath,
            });
            if (!folder) {
                return res
                    .status(404)
                    .send({ status: false, message: "Folder not found" });
            }
            const parentPath = new RegExp(`${folder.path}/`, "i");
            await Folder.deleteMany({
                user: login,
                path: parentPath,
            });
            await File.deleteMany({
                user: login,
                url: parentPath,
            });
            await File.deleteMany({
                user: login,
                url: folderPath,
            });
            const userPath = path.join(
                __dirname,
                `../../uploads/${login}/root${folder.path}`
            );
            fs.rmdir(userPath, { maxRetries: 3, recursive: true }, (err) => {
                if (err) {
                    console.log("Error in delete account - fs :>> ", err);
                }
            });
            folder.deleteOne((err) => {
                if (err) {
                    console.log("Error in Delete one folder :>> ", err);
                    return res.status(500).send({
                        status: false,
                        message: "Error! Contact the administrator",
                    });
                }
                return res.status(200).send({
                    status: false,
                    message: "Deleted one folder - success",
                });
            });
        },
    },
};
