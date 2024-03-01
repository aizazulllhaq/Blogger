const { Router } = require("express");

const userRouter = Router();
const userController = require('../controllers/userController');

const multer = require('multer');
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
    .get("/signup", userController.signInPage)
    .get('/signin', userController.signUpPage)
    .post('/signup', upload.single('profileImageURL'), userController.signup)
    .post('/signin', userController.signIn)
    .get('/logout', userController.logout);


module.exports = userRouter;