const { Router } = require("express");

const blogRouter = Router();
const blogController = require('../controllers/blogController');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/blogs/');
    },
    filename: function (req, file, cb) {
        const filename = `${Date.now()}_${file.originalname}`.replace(/ /g, '_');
        cb(null, filename);
    }
})
const upload = multer({ storage });

blogRouter
    .post('/new', upload.single('coverImage'), blogController.new)
    .get('/:id', blogController.blog);


module.exports = blogRouter;