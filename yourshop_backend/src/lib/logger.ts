import pino from 'pino';

const isProd = process.env.NODE_ENV === 'production';

export const logger = pino({
    name: 'yourshop-backend',
    level: isProd ? 'info' : 'debug',
    transport: isProd ? undefined : { target: 'pino-pretty' },
    redact: {
        paths: [
            // nagłówki
            'req.headers.authorization',
            'req.headers.cookie',
            'res.headers["set-cookie"]',
            // potencjalne pola w body/query
            'req.body.password',
            'req.body.token',
            'req.body.accessToken',
            'req.body.refreshToken',
            'req.query.token',
        ],
        censor: '[REDACTED]',
    },
});
