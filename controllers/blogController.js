const ExpressError = require("../middlewares/ErrorHandling");
const { Blog } = require("../models/Blog.model");
const { wrapAsync } = require("../utils/wrapAsync");

exports.newBlogPage = (req, res) => {
    res.render("Blogs/new");
}

exports.getAllBlogs = wrapAsync(async (req, res, next) => {
    const blogs = await Blog.find({}).sort({ createdAt: -1 }).populate("createdBy");
    res.json({
        success: true,
        data: blogs,
    })
})


exports.newBlog = wrapAsync(async (req, res, next) => {
    const { title, content } = req.body;
    const newBlog = new Blog({ title, content });
    newBlog.coverImage = req.file.path;
    newBlog.createdBy = req.user.id;

    await newBlog.save();

    res.json({
        success: true,
        msg: "Blog Created Successfully",
    })
})

exports.blog = wrapAsync(async (req, res, next) => {
    const { id } = req.params;

    const blog = await Blog.findById(id).populate("createdBy");

    if (!blog) return next(new ExpressError(404, "Blog Not Found"));

    res.json({
        success: true,
        data: blog,
    })
})

exports.editBlogPage = wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const blog = await Blog.findById(id);

    if (!blog) return res.json({ success: false, msg: "Blog Not Found" });

    res.json({
        success: true,
        message: "Edit your blog",
        data: blog
    })
})

exports.updateBlog = wrapAsync(async (req, res, next) => {
    const { title, content } = req.body;
    const { id } = req.params;

    const blog = await Blog.findById(id);

    if (!blog) return next(new ExpressError(404, "Blog Not Found"));

    await Blog.updateOne({ _id: id }, { title, content })
    blog.coverImage = req.file.path;

    await updateBlog.save();
})

exports.deleteBlog = wrapAsync(async (req, res, next) => {
    const { id } = req.params

    if (!blog) return next(new ExpressError(404, "Blog Not Found"));

    await Blog.findByIdAndDelete(id);

    res.json({
        success: true,
        msg: "Blog Deleted",
    })
})