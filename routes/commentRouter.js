const { Router } = require("express");
const commentRouter = Router();
const commentController = require('../controllers/commentController');

commentRouter
    .post("/new", commentController.new)
    .get("/:commentID", commentController.get)
    .post("/:commentID/update", commentController.update)
    .delete("/:commentID/delete", commentController.destroy)


module.exports = commentRouter;