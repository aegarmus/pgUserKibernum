import { query } from "../../../config/db.config.js"

export const userTable = async () => {
    try {
        console.log('Inicializando tabla usuario')

        await query(`
            CREATE TABLE IF NOT EXISTS users (
                id UUID PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                lastname VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL UNIQUE,
                phone VARCHAR(30),
                birthdate DATE,
                budget NUMERIC NOT NULL DEFAULT 0,
                active BOOLEAN NOT NULL DEFAULT true,
                created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
                deleted_at TIMESTAMP NULL 
            );
        `)

        console.log('Tabla usuario verificada')
    } catch (error) {
        console.error(`Error al inicializar tabla user: ${JSON.stringify(error)}`)
        throw new Error('Error al inicializar la tabla users')
    }
}