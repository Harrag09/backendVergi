const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

module.exports.verifyAccessToken = async (req, res, next) => {
    try {
        const { access_token } = req.cookies;

        const secretKey = process.env.ACCESS_TOKEN2;

        if (access_token) {
            jwt.verify(access_token, secretKey, (err, user) => {
                if (err) {
                    return res.status(403).json({
                        msg: err?.message,
                        success: false
                    });
                }
                req.user = user;
                next();
            });
        } else {
            return res.status(400).json({
                msg: "No cookie found.",
                success: false
            });
        }
    } catch (err) {
        res.status(500).json({ msg: err?.message, success: false });
    }
};

module.exports.verifyUser = (req, res, next) => {
    try {
        if (req.user.id == req.params.id || req.user.isAdmin) {
            next();
        } else {
            return res.status(403).json({ msg: "You are not authorized.", success: false });
        }
    } catch (err) {
        res.status(500).json({ msg: err?.message, success: false });
    }
};
