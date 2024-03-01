const jwt = require("jsonwebtoken")


exports.createTokenForUser = (user) => {
    const payload = {
        id: user._id,
        email: user.email,
        role: user.role,
        profileImage: user.prfileImageURL
    }

    const token = jwt.sign(payload, process.env.SECRET)
    return token;
}

exports.verifyUserToken = (token) => {
    const payload = jwt.verify(token, process.env.SECRET);
    return payload;
}