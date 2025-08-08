import Joi from 'joi';
export const validateCommunity = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(100).required(),
        description: Joi.string().min(10).max(500).required(),
        tags: Joi.array().items(Joi.string().max(50)).max(10),
        isPrivate: Joi.boolean().default(false),
        settings: Joi.object({
            allowMemberPosts: Joi.boolean().default(true),
            allowMemberInvites: Joi.boolean().default(true),
            requireApproval: Joi.boolean().default(false)
        })
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
//# sourceMappingURL=community.js.map