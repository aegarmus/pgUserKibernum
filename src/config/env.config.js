import dotenv from 'dotenv'

dotenv.config()

export const env = {
    app: {
        port: process.env.PORT,
        env: process.env.ENVIRONMENT
    },
    db: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
    }
}