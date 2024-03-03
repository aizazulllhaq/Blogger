const ExpressError = require('../middlewares/ErrorHandling');
const { Blog } = require('../models/Blog.model');
const { Comment } = require('../models/Comment.model');
const { wrapAsync } = require('../utils/wrapAsync');

exports.new = wrapAsync(async (req, res, next) => {
    const { id, comment } = req.body;

    const blog = await Blog.findById(id);

    if (!blog) return next(404, "Blog Not Found");

    const newComment = new Comment({ comment });
    newComment.author = req.user.id;
    blog.comments.push(newComment._id);


    await newComment.save();
    await blog.save();

    res.status(201).json({
        success: true,
        msg: "New Comment Created Successfull",
        data: newComment,
    })
})

exports.update = wrapAsync(async (req, res, next) => {
    const { id, commentID } = req.params;
    const { comment } = req.body;

    const blog = await Blog.findById(id);

    if (!blog) return next(404, "Blog Not Found");

    let com = await Blog.findById(id);

    if (!com) return next(404, "Comment Not Found");

    const updateComment = await Comment.updateOne({ comment });

    await updateComment.save();

    res.status(200).json({
        success: true,
        msg: "Comment Updated Successfull",
        data: com
    })
})

exports.destroy = wrapAsync(async (req, res, next) => {
    const { id, commentID } = req.params

    const blog = await Blog.findById(id);

    if (!blog) return next(404, "Blog Not Found");

    const delComment = await Blog.findByIdAndDelete(id);

    res.status(200).json({
        success: true,
        msg: "Comment Delete Successfull",
        data: delComment
    })

})