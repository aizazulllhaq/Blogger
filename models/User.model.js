const { Schema, model } = require("mongoose");
const bcrypt = require('bcryptjs');
const { createTokenForUser } = require("../utils/authenticationToken");

const userSchema = new Schema({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    salt: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    prfileImageURL: {
        type: String,
        default: "/uploads/public/userAvatar.jpeg"
    },
    role: {
        type: String,
        enum: ['USER', 'ADMIN'],
        default: "USER"
    }
}, {
    timestamps: true
});

userSchema.pre("save", async function (next) {
    const user = this;

    if (!user.isModified("password")) return;

    const salt = await bcrypt.genSalt(16);;

    const hashedPassword = await bcrypt.hash(user.password, salt);

    this.salt = salt;
    this.password = hashedPassword;

    next();
});

userSchema.static("matchPasswordAndGenerateToken", async function (email, password) {
    const user = await this.findOne({ email });

    if (!user) throw new Error("User Not Found");

    // const salt = user.salt;
    const hashedPassword = user.password;

    const userProvidedHash = await bcrypt.compare(password, hashedPassword);

    // if (hashedPassword !== userProvidedHash) throw new Error("Incorrect Credentials");
    if (!userProvidedHash) throw new Error("Incorrect Credentials");

    const token = createTokenForUser(user);

    return token;
})


exports.User = model("User", userSchema);
