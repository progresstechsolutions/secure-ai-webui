import Joi from 'joi';
export const validateComment = (req, res, next) => {
    const schema = Joi.object({
        content: Joi.string().min(1).max(1000).required(),
        postId: Joi.string().required(),
        parentCommentId: Joi.string().optional()
    });
    const { error } = schema.validate(req.body);
    if (error) {
        res.status(400).json({
            error: 'Validation failed',
            details: error.details.map(d => d.message)
        });
        return;
    }
    next();
};
//# sourceMappingURL=comment.js.map