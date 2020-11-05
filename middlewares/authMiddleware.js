const passport = require("passport");

module.exports = (req, res, next) => {
  return passport.authenticate("jwt", { session: false })(req, res, next);
};
