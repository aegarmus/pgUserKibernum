import { DBError } from "../../../utils/errors.util.js"
import { Logger } from "../../../utils/Logger.js"
import { orderTable } from "./oder.table.js"
import { userTable } from "./User.table.js"


const logger = new Logger('DATABASE')

export const initializerTables = async() => {
    try {
        logger.info('Inicializando tablas')
        await userTable()
        await orderTable()

        logger.info('Tablas inicializadas con éxito')
    } catch (error) {
        logger.error('Error al inicializar las tablas', error)
        throw new DBError('Error al inicializar las tablas', error)
    }
}