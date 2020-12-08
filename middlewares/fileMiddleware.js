const File = require("../models/File");
const path = require("path");
const sharp = require("sharp");

let save = async (file, url) => {
    await file.mv(`./uploads/${url}`, () => {
        return true;
    });
    return false;
};

resizeImage = async (filePath, login, fileName, { width, height }) => {
    const newPath = path.join(
        __dirname,
        `../uploads/${login}/resizedImage/${fileName}`
    );
    await sharp(filePath).resize(width, height).toFile(newPath);
    return newPath;
};

module.exports = {
    save,
    resizeImage,
};
