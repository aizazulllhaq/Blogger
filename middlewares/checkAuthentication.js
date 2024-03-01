const { verifyUserToken } = require("../utils/authenticationToken");

exports.checkForUserAuthentication = (req, res, next) => {

    const { token } = req.cookies

    req.user = null;

    if (!token) return next();

    try {
        const user = verifyUserToken(token);
        req.user = user;
    } catch (err) {
        res.json({
            success: false,
            error: err.message,
        })
    }
    next();
}