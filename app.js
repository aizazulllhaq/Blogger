require('dotenv').config();
const express = require("express");
const { dbConnection } = require("./utils/dbConnection");
const app = express();
const ejs = require('ejs');
const path = require('path');
const userRouter = require('./routes/userRoutes');
const { checkForUserAuthentication } = require('./middlewares/checkAuthentication');
const cookieParser = require('cookie-parser');


// Database Connection
dbConnection(process.env.MONGO_URL);

// Middlewares
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"))
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(checkForUserAuthentication);


// Routes
app.use("/api/users", userRouter);

// Server Listening
app.listen(process.env.PORT, () => {
    console.log(`Server started on http://localhost:${process.env.PORT}`);
});