import { query } from "../../config/db.config.js";
import { DBError } from "../../utils/errors.util.js";
import { Logger } from "../../utils/Logger.js";
import { initializerTables } from "./tables/init.tables.js";


export class DB {
    static logger = new Logger('DATABASE')

    static async checkDBConnection () {
        try {
            this.logger.info('Conectando con la base de datos')
            await query('SELECT NOW()');
            this.logger.info('Base de datos conectada con éxito! 👾')
        } catch (error) {
            this.logger.error(`Error al conectarse con la base de datos`, error);
            throw new DBError(`No pudimos conectarnos a la base de datos`, error)
        }
    }

    static async init() {
        try {
            await this.checkDBConnection()
            await initializerTables()
        } catch (error) {
            console.error(`Error al inicializar la DB: ${JSON.stringify(error)}`)
            throw new DBError('Error al inicializar la DB', error)
        }
    }
}