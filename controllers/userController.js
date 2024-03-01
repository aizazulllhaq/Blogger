const { User } = require("../models/User.model");


exports.signUpPage = (req, res) => {
    res.render('signUp');
}

exports.signup = async (req, res) => {
    const { fullname, email, password } = req.body;
    try {
        // Check if the email already exists in the db
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: "Email already exists"
            });
        }

        const newUser = new User({ fullname, email, password });
        await newUser.save();

        return res.status(201).json({
            success: true,
            message: "Signup Successful"
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
};


exports.signInPage = (req, res) => {
    res.render('signUp');
}

exports.signIn = async (req, res) => {
    const { email, password } = req.body;
    try {
        const token = await User.matchPasswordAndGenerateToken(email, password);

        res.cookie("token", token).status(200).json({
            success: true,
            msg: "Login Successfull",
        });
    } catch (err) {
        let statusCode = 500; // Internal Server Error by default
        if (err.message === "User Not Found") {
            statusCode = 404; // Not Found
        } else if (err.message === "Incorrect Credentials") {
            statusCode = 401; // Unauthorized
        }
        res.status(statusCode).json({
            success: false,
            error: err.message
        });
    }
};


exports.logout = (req, res) => {
    res.clearCookie('token').json({
        success: true,
        msg: "Logout Successfull",
    })
}