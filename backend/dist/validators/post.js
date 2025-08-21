import Joi from 'joi';
export const validatePost = (req, res, next) => {
    const schema = Joi.object({
        title: Joi.string().min(5).max(200).required(),
        content: Joi.string().min(10).max(5000).required(),
        communityId: Joi.string().required(),
        tags: Joi.array().items(Joi.string().max(50)).max(10),
        images: Joi.array().items(Joi.string()).max(5),
        videos: Joi.array().items(Joi.string()).max(5),
        isAnonymous: Joi.boolean().optional(),
        attachments: Joi.array().items(Joi.object({
            filename: Joi.string().required(),
            originalName: Joi.string().required(),
            url: Joi.string().required(),
            size: Joi.number().required()
        })).max(5)
    });
    const { error } = schema.validate(req.body);
    if (error) {
        console.log('🚫 Post validation failed:', error.details.map(d => d.message));
        console.log('📊 Request body:', JSON.stringify(req.body, null, 2));
        res.status(400).json({
            error: 'Validation failed',
            details: error.details.map(d => d.message)
        });
        return;
    }
    next();
};
//# sourceMappingURL=post.js.map