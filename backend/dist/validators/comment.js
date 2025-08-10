import Joi from 'joi';
export const validateComment = (req, res, next) => {
    console.log('🔍 Validating comment request:');
    console.log('- Body:', req.body);
    const schema = Joi.object({
        content: Joi.string().min(1).max(1000).required(),
        parentCommentId: Joi.string().optional()
    });
    const { error } = schema.validate(req.body);
    if (error) {
        console.log('❌ Validation failed:', error.details);
        res.status(400).json({
            error: 'Validation failed',
            details: error.details.map(d => d.message)
        });
        return;
    }
    console.log('✅ Validation passed');
    next();
};
//# sourceMappingURL=comment.js.map