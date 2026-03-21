import { query } from "../../../config/db.config.js"
import { DBError } from "../../../utils/errors.util.js"
import { Logger } from "../../../utils/Logger.js"

const logger = new Logger('DATABASE')

export const userTable = async () => {
    try {
        logger.debug('Inicializando tabla usuario')

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

        logger.debug('Tabla usuario verificada')
    } catch (error) {
        logger.error(`Error al inicializar tabla user: ${JSON.stringify(error)}`)
        throw new DBError('Error al inicializar la tabla users', error)
    }
}