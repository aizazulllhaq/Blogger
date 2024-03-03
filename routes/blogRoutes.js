const { Router } = require("express");
const blogRouter = Router();
const blogController = require('../controllers/blogController');
const multer = require('multer');
const { isSchemaValidate } = require("../utils/schemasValidation");
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
    .get('/new', blogController.newBlogPage)
    .get('/', blogController.getAllBlogs)
    .post('/new', isSchemaValidate, upload.single('coverImage'), blogController.newBlog)
    .get('/:id', blogController.blog)
    .get('/:id/edit', blogController.editBlogPage)
    .patch('/:id/edit', isSchemaValidate, blogController.updateBlog)
    .delete('/:id', blogController.deleteBlog);


module.exports = blogRouter;