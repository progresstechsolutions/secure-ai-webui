// Middleware to extract user info from headers (since it comes from another app)
export const extractUserInfo = (req, res, next) => {
    console.log('🔍 Extracting user info from headers:');
    console.log('- Headers:', {
        'x-user-id': req.headers['x-user-id'],
        'x-user-email': req.headers['x-user-email'],
        'x-user-name': req.headers['x-user-name'],
        'x-user-avatar': req.headers['x-user-avatar']
    });
    const userId = req.headers['x-user-id'];
    const userEmail = req.headers['x-user-email'];
    const userName = req.headers['x-user-name'];
    const userAvatar = req.headers['x-user-avatar'];
    if (!userId) {
        console.log('❌ User ID is missing from headers');
        res.status(400).json({ error: 'User ID is required in headers' });
        return;
    }
    console.log('✅ User extracted:', { id: userId, name: userName, email: userEmail });
    req.user = {
        id: userId,
        email: userEmail,
        name: userName,
        avatar: userAvatar
    };
    next();
};
//# sourceMappingURL=userExtract.js.map