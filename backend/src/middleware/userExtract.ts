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
  console.log('🔍 Extracting user info from headers:');
  console.log('- Headers:', {
    'x-user-id': req.headers['x-user-id'],
    'x-user-email': req.headers['x-user-email'],
    'x-user-name': req.headers['x-user-name'],
    'x-user-avatar': req.headers['x-user-avatar']
  });
  
  const userId = req.headers['x-user-id'] as string;
  const userEmail = req.headers['x-user-email'] as string;
  const userName = req.headers['x-user-name'] as string;
  const userAvatar = req.headers['x-user-avatar'] as string;

  if (!userId) {
    console.log('❌ User ID is missing from headers');
    res.status(400).json({ error: 'User ID is required in headers' });
    return;
  }

  console.log('✅ User extracted:', { id: userId, name: userName, email: userEmail });
  (req as RequestWithUser).user = {
    id: userId,
    email: userEmail,
    name: userName,
    avatar: userAvatar
  };

  next();
};
