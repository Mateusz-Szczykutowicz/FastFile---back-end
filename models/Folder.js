const mongoose = require("mongoose");

const slug = require("mongoose-url-slugs");

let Folder = new mongoose.Schema(
    {
        user: {
            type: String,
            trim: true,
            lowercase: true,
        },
        name: {
            type: String,
            trim: true,
            lowercase: true,
            default: "root",
        },
        parent: {
            type: String,
            trim: true,
            lowercase: true,
            default: "",
        },
        path: {
            type: String,
            trim: true,
            lowercase: true,
            default: "",
        },
    },
    { timestamps: true }
);

Folder.plugin(slug("name", { field: "slug", update: true }));

module.exports = mongoose.model("Folder", Folder);
