const { Router } = require("express");

const userRouter = Router();
const userController = require('../controllers/userController');
const multer = require('multer');
const { restrictTo, restrictNonLoginUser } = require("../middlewares/checkAuthentication");
const { isSchemaValidate } = require("../utils/schemasValidation");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/uploads/");
    },
    filename: function (req, file, cb) {
        const filename = `${Date.now()}_${file.originalname}`.replace(/ /g, '_');
        cb(null, filename)
    }
})

const upload = multer({ storage })

userRouter
    .get("/signup", userController.signUpPage)
    .get('/signin', userController.signInPage)
    .get("/verify", restrictNonLoginUser(["USER", "ADMIN"]), userController.verifyMail)
    .get('/resetPassword', userController.resetPasswordPage)
    .post("/resetPassword", userController.resetPassword)
    .get("/changePassword", userController.changePassword)
    .post("/changePassword", userController.setNewPassword)
    .post('/signup', upload.single('profileImage'), isSchemaValidate, userController.signup)
    .post('/signin', userController.signIn)
    .get('/logout', restrictTo(["USER", "ADMIN"]), userController.logout);


module.exports = userRouter;