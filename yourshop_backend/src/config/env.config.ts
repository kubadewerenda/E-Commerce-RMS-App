import 'dotenv/config'

export const env = {
    port: Number(process.env.PORT || 8000),
    nodeEnv: process.env.NODE_ENV || 'development',
    databaseUrl: process.env.DATABASE_URL || '',
};
