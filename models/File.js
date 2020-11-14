const mongoose = require("mongoose");

const slug = require("mongoose-url-slugs");

let File = new mongoose.Schema(
    {
        user: String,
        name: String,
        size: Number,
        mimetype: String,
        url: String,
    },
    { timestamps: true }
);

File.plugin(slug("name", { field: "slug", update: true }));

module.exports = mongoose.model("File", File);
