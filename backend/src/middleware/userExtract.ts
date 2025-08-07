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

// Middleware to extract user info from headers (since it comes from another app)
export const extractUserInfo = (req: Request, res: Response, next: NextFunction): void => {
  const userId = req.headers['x-user-id'] as string;
  const userEmail = req.headers['x-user-email'] as string;
  const userName = req.headers['x-user-name'] as string;
  const userAvatar = req.headers['x-user-avatar'] as string;

  if (!userId) {
    res.status(400).json({ error: 'User ID is required in headers' });
    return;
  }

  (req as RequestWithUser).user = {
    id: userId,
    email: userEmail,
    name: userName,
    avatar: userAvatar
  };

  next();
};
