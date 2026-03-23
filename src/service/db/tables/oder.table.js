import { query } from "../../../config/db.config.js"
import { DBError } from "../../../utils/errors.util.js"
import { Logger } from "../../../utils/Logger.js"


const logger = new Logger('DATABASE')

export const orderTable = async() => {
    try {
        logger.debug('Inicializando tabla order')

        await query(`
            CREATE TABLE IF NOT EXISTS orders (
                id UUID PRIMARY KEY,
                user_id UUID NOT NULL,
                title VARCHAR(200) NOT NULL,
                description TEXT,
                amount NUMERIC NOT NULL CHECK (amount > 0), 
                status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled', 'refunded')),
                order_date TIMESTAMP NOT NULL DEFAULT NOW(),
                active BOOLEAN NOT NULL DEFAULT true,
                created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
                deleted_at TIMESTAMP NULL,
                CONSTRAINT fk_order_user
                    FOREIGN KEY (user_id)
                    REFERENCES users(id)
                    ON DELETE RESTRICT
                    ON UPDATE CASCADE
            );
        `);

        await query(`
            CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id)    
        `)

        await query(`
            CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)    
        `)

        logger.debug('Tablar orders verificada')
    } catch (error) {
        logger.error(`Error al inicializar la tabla orders: ${error.message}`)
        throw new DBError('Error al inicializar la tabla error', error)
    }
}