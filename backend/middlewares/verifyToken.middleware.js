const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.verifyToken = async (req, res, next) => {
    const accessToken = req.cookies.access_token;

    if (!accessToken) {
        return res.status(401).json({ message: "Token is expired" });
    }

    try {
        jwt.verify(accessToken, process.env.JSONWENTOKEN_SIGN_SECRET, (err, user) => {
            if (err) {
                console.error("Error verifying token:", err);
                return res.status(500).json({ error: "Internal server error" });
            }
            req.user = user;
            req.id = user.id;
            next();
        });
    } catch (err) {
        console.error("Error verifying token:", err);
        return res.status(401).json({ message: "Invalid token" });
    }
};
