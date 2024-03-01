const { Router } = require("express");

const blogRouter = Router();
const blogController = require('../controllers/blogController');

blogRouter
    .post('/new', blogController.new)
    .get('/:id', blogController.blog);


module.exports = blogRouter;