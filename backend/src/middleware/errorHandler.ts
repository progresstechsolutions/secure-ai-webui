import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';

interface MongoError extends Error {
  name: string;
  code?: number;
  keyValue?: Record<string, unknown>;
  errors?: Record<string, { message: string }>;
  status?: number;
}

export const errorHandler = (err: MongoError, req: Request, res: Response, next: NextFunction): void => {
  logger.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip
  });

  if (err.name === 'ValidationError') {
    res.status(400).json({
      error: 'Validation Error',
      details: err.errors ? Object.values(err.errors).map(e => e.message) : []
    });
    return;
  }

  if (err.name === 'CastError') {
    res.status(400).json({
      error: 'Invalid ID format'
    });
    return;
  }

  if (err.code === 11000) {
    const keyValue = err.keyValue || {};
    res.status(409).json({
      error: 'Duplicate entry',
      field: Object.keys(keyValue)[0]
    });
    return;
  }

  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message
  });
};
