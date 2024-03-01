const { Blog } = require("../models/Blog.model");

exports.new = async (req, res) => {
    try {
        const { title, content } = req.body;
        const newBlog = new Blog({ title, content });
        newBlog.coverImage = req.file.path;
        newBlog.createdAt = req.user.id;

        await newBlog.save();

        res.json({
            success: true,
            msg: "Blog Created Successfully",
        })
    } catch (err) {
        res.json({
            success: false,
            error: err.message
        })
    }
}

exports.blog = async (req, res) => {
    try {
        const { id } = req.params;

        const blog = await Blog.findById(id);

        if (!blog) return res.json({ success: false, msg: "Blog Not Found" });

        res.json({
            success: true,
            data: blog,
        })

    } catch (err) {
        res.json({
            success: false,
            error: err.message
        })
    }
}