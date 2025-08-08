import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

export const validateCommunity = (req: Request, res: Response, next: NextFunction): void => {
  const schema = Joi.object({
    title: Joi.string().min(3).max(100).required(), // Changed from 'name' to 'title'
    description: Joi.string().min(10).max(500).required(),
    tags: Joi.array().items(Joi.string().max(50)).min(1).max(10).required(), // Required for genetic conditions
    location: Joi.object({
      region: Joi.string().required(),
      state: Joi.string().allow('')
    }).required(),
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
