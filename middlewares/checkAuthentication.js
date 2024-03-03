const { verifyUserToken } = require("../utils/authenticationToken");
const ExpressError = require("./ErrorHandling");

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


exports.restrictNonLoginUser = (role = []) => {
    return (req, res, next) => {

        if (!req.user) return next(new ExpressError(401, "Unauthorized ! Please First Login"));

        if (!role.includes(req.user.role)) return next(new ExpressError(400, "Role Must be Present"));

        next();
    }
}

exports.restrictTo = (role = []) => {
    return (req, res, next) => {

        if (!req.user) return next(new ExpressError(401, "Unauthorized ! Please First Login"));

        if (!req.user.is_verify) return next(new ExpressError(400, "Please Verify you Mail"));

        if (!role.includes(req.user.role)) return next(new ExpressError(400, "Role Must be Present"));

        next();
    }
}