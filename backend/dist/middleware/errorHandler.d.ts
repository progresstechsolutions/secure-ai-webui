import { Request, Response, NextFunction } from 'express';
interface MongoError extends Error {
    name: string;
    code?: number;
    keyValue?: Record<string, unknown>;
    errors?: Record<string, {
        message: string;
    }>;
    status?: number;
}
export declare const errorHandler: (err: MongoError, req: Request, res: Response, next: NextFunction) => void;
export {};
//# sourceMappingURL=errorHandler.d.ts.map