import { Request, Response, NextFunction } from 'express';
export interface UserInfo {
    id: string;
    email?: string;
    name?: string;
    avatar?: string;
}
export interface RequestWithUser extends Request {
    user: UserInfo;
}
export declare const extractUserInfo: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=userExtract.d.ts.map