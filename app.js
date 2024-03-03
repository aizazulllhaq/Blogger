require('dotenv').config();
const express = require("express");
const { dbConnection } = require("./utils/dbConnection");
const app = express();
const ejs = require('ejs');
const path = require('path');
const userRouter = require('./routes/userRoutes');
const { checkForUserAuthentication, restrictTo } = require('./middlewares/checkAuthentication');
const cookieParser = require('cookie-parser');
const blogRouter = require('./routes/blogRoutes');
const ExpressError = require('./middlewares/ErrorHandling');


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
app.use("/blogs", restrictTo(["USER", "ADMIN"]), blogRouter);


// Pages which Doesn't Exists
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
})

// Error Handling Middleware
app.use((err, req, res, next) => {
    const { status = 500, message = "Internal Server Error" } = err;
    res.status(status).json({
        success: false,
        error: message,
    })
})

// Server Listening
app.listen(process.env.PORT, () => {
    console.log(`Server started on http://localhost:${process.env.PORT}`);
});