let save = async (file, url, user) => {
  await file.mv(`./uploads/${url}`, () => {
    return true;
  });
  return false;
};

module.exports = {
  save,
};
