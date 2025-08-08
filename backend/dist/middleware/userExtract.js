// Middleware to extract user info from headers (since it comes from another app)
export const extractUserInfo = (req, res, next) => {
    const userId = req.headers['x-user-id'];
    const userEmail = req.headers['x-user-email'];
    const userName = req.headers['x-user-name'];
    const userAvatar = req.headers['x-user-avatar'];
    if (!userId) {
        res.status(400).json({ error: 'User ID is required in headers' });
        return;
    }
    req.user = {
        id: userId,
        email: userEmail,
        name: userName,
        avatar: userAvatar
    };
    next();
};
//# sourceMappingURL=userExtract.js.map