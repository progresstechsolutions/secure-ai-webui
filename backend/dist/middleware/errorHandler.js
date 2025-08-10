import { logger } from '../utils/logger.js';
export const errorHandler = (err, req, res, next) => {
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
//# sourceMappingURL=errorHandler.js.map