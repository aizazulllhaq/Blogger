const { Router } = require("express");

const userRouter = Router();
const userController = require('../controllers/userController');


userRouter
    .get("/signup", userController.signInPage)
    .get('/signin', userController.signUpPage)
    .post('/signup', userController.signup)
    .post('/signin', userController.signIn)
    .get('/logout', userController.logout);


module.exports = userRouter;