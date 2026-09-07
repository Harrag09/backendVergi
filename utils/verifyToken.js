const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

module.exports.verifyAccessToken = async (req, res, next) => {
    try {
        const cookieToken = req.cookies?.access_token;
        const headerToken = req.headers.authorization?.startsWith('Bearer ')
            ? req.headers.authorization.slice(7)
            : null;
        const access_token = cookieToken || headerToken;

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
                        msg: "No access token found.",
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
