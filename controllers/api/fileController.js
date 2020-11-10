const File = require("../../models/File.js");
const fileMiddleware = require("../../middlewares/fileMiddleware.js");

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
          return res
            .status(200)
            .send({ status: true, message: "Files found!", data: data });
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
      let uri = `${url}/${file.name}`;
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
          return res
            .status(409)
            .send({ status: false, message: "This file already exists" });
        } else {
          if (file.size < 6 * 1024 * 1024) {
            if (fileMiddleware.save(file, uri, user)) {
              myFile.save();
              return res
                .status(201)
                .send({ status: true, message: "Upload - success" });
            } else {
              return res.status(500).send({
                status: false,
                message: "Error! Contact the administrator",
              });
            }
          } else {
            return res
              .status(406)
              .send({ status: false, message: "The file is too large" });
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
    readAll() {},
    readOne() {},
    create() {},
    updateOne() {},
    deleteOne() {},
  },
};
