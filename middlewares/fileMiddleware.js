const File = require("../models/File");

let save = async (file, url) => {
    await file.mv(`./uploads/${url}`, () => {
        return true;
    });
    return false;
};

module.exports = {
    save,
};
