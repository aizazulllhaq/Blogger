const Joi = require('joi');
const ExpressError = require('../middlewares/ErrorHandling');

exports.usersSchemaValidation = Joi.object({
    fullname: Joi.string().required(),
    email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com'] } }),
    password: Joi.string().required().min(6).max(30),
    profileImage: Joi.string(),
})

exports.blogsSchemaValidation = Joi.object({
    title: Joi.string().required().min(3).max(20),
    content: Joi.string().required(),
    coverImage: Joi.string().allow("", null),
    createdBy: Joi.string(),
    comments: Joi.array(),
})

exports.commentsSchemaValidation = Joi.object({
    comment: Joi.string().required(),
    author: Joi.string(),
})

exports.isSchemaValidate = (req, res, next) => {
    const { error } = this.usersSchemaValidation.validate(req.body);
    if (error) {
        throw new ExpressError(404, error.message);
    } else {
        next();
    }
}
