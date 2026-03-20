import { query } from "../../config/db.config.js";
import { userTable } from "./tables/User.table.js";

export class DB {
    static async checkDBConnection () {
        try {
            const { rows } = await query('SELECT NOW()');
            console.log(rows[0])
        } catch (error) {
            console.error(`Error al conectarse con la base de datos: ${JSON.stringify(error)}`);
            throw new Error(`No pudimos conectarnos a la base de datos`)
        }
    }

    static async init() {
        try {
            await this.checkDBConnection()
            console.log('Inicializando tablas')
            await userTable()
            console.log('Tablas inicializadas con éxito')
        } catch (error) {
            console.error(`Error al inicializar la DB: ${JSON.stringify(error)}`)
            throw new Error('Error al inicializar la DB')
        }
    }
}