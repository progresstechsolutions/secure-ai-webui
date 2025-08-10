export const corsOptions = {
    origin: [
        process.env.FRONTEND_URL || 'http://localhost:3000',
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:3002'
    ],
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-User-ID',
        'X-User-Email',
        'X-User-Avatar',
        'x-user-id',
        'x-user-name',
        'x-user-avatar',
        'x-user-email'
    ]
};
//# sourceMappingURL=cors.js.map