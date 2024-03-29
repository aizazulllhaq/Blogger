const ExpressError = require("../middlewares/ErrorHandling");
const { User } = require("../models/User.model");
const { createTokenForUser } = require("../utils/authenticationToken");
const { sendResetPasswordLink } = require("../utils/sendResetPasswordLink");
const { sendVerificationMail } = require("../utils/sendVerificationMail");
const { wrapAsync } = require("../utils/wrapAsync");


exports.signUpPage = (req, res) => {
    res.render('Authentication/signUp');
}

exports.signup = wrapAsync(async (req, res) => {
    const { fullname, email, password } = req.body;
    // Check if the email already exists in the db
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({
            success: false,
            error: "Email already exists"
        });
    }

    const newUser = new User({ fullname, email, password });
    newUser.profileImage = req.file.path;

    await newUser.save();

    sendVerificationMail(fullname, email, newUser._id);

    return res.status(201).json({
        success: true,
        message: "Signup Successful Please Verify your Mail"
    });
})


exports.signInPage = (req, res) => {
    res.render('Authentication/signIn');
}

exports.signIn = wrapAsync(async (req, res) => {
    const { email, password } = req.body;
    const token = await User.matchPasswordAndGenerateToken(email, password);

    res.cookie("token", token).status(200).json({
        success: true,
        msg: "Login Successfull",
    });
});


exports.logout = (req, res) => {
    res.clearCookie('token').json({
        success: true,
        msg: "Logout Successfull",
    })
}

exports.verifyMail = wrapAsync(async (req, res, next) => {
    const { id, expiry, token } = req.query;
    const currentTime = Math.floor(Date.now() / 1000);
    let verifyTrue = false;

    // Checking Verification Link Expiration . 
    if (expiry && currentTime > expiry) {
        return res.json({ success: false, msg: "Verification link has expired . Resend your verification mail" });
    }

    // Find the user by ID
    const user = await User.findById(id);

    if (!user) {
        return res.json({ success: false, msg: "User Not Found" });
    }

    // Check if the token has already been used
    if (user.token) {
        return next(new ExpressError(400, "Verification has already been used"));
    }

    // Mark the token as used
    user.token = token;
    user.is_verify = true;
    await user.save();
    // console.log(user)

    // Creating New Jwt Token with is_verify=true and send to user
    const jwtToken = createTokenForUser(user);


    return res.cookie("token", jwtToken).json({
        success: true,
        msg: "User Email Verified",
    });
})


// Reset Password Functionality

exports.resetPasswordPage = (req, res) => {
    res.render("Authentication/resetPassword");
}

exports.resetPassword = wrapAsync(async (req, res, next) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) return next(new ExpressError(404, "User Not Found with this Email"));

    sendResetPasswordLink(user.fullname, user.email, user._id);

    res.status(200).json({
        success: true,
        msg: "Reset Password mail has been send",
        user,
        email
    })
})


exports.changePassword = wrapAsync(async (req, res, next) => {
    const { id, expiry, rp_token } = req.query;
    const currentTime = Math.floor(Date.now() / 1000);

    // Checking Verification Link Expiration . 
    if (expiry && currentTime > expiry) {
        return next(new ExpressError(400, "Reset Password link has expired . Reset Again"));
    }

    // Find the user by ID and rp_token within the array
    const user = await User.findOne({ _id: id, rp_token: { $elemMatch: { $eq: rp_token } } });

    if (!user) {
        return next(new ExpressError(404, "User Not Found"));
    }

    return res.render("Authentication/newPassword", { id });
})

exports.setNewPassword = wrapAsync(async (req, res, next) => {

    const { id, password } = req.body;

    // Find the user by ID and rp_token within the array
    const user = await User.findById(id);

    if (!user) {
        return next(new ExpressError(404, "User Not Found"));
    }

    user.password = password;

    await user.save();


    res.status(200).json({
        success: true,
        msg: "Password has been Change Successfully",
        user
    })

})
