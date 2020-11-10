const User = require("../models/User");

module.exports = {
    async getUser(token) {
        if (!token) {
            return false;
        }
        token = token.split(".");
        let signature = token[1];
        let user = await User.findOne({ signature });
        return user;
    },
};
