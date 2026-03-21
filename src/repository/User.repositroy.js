import { query } from "../config/db.config.js"
import { User } from "../model/User.model.js"
import { Logger } from "../utils/Logger.js"


export class UserRepository {
    static logger = new Logger('USER_REPO')

    static mapRowToEntity(row) {
        if(!row) return null

        return new User({
            id: row.id,
            name: row.name,
            lastname: row.lastname,
            email: row.email,
            phone: row.phone,
            birthdate: row.birthdate,
            budget: row.budget,
            active: row.active,
            deletedAt: row.deleted_at,
            createdAt: row.created_at,
            updatedAt: row.updated_at
        })
    }

    static async create(user) {
        try {
            const sql = `
                INSERT INTO users (
                    id, name, lastname, email, phone, birthdate, budget, active, deleted_at
                ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
                RETURNING *;
            `

            const values = [
                user.id,
                user.name,
                user.lastname,
                user.email,
                user.phone,
                user.birthdate,
                user.budget,
                user.active,
                user.deletedAt
            ]

            this.logger.info('Inicializando consulta de inserción de datos')
            const { rows } = await query(sql, values)
            this.logger.info('Datos insertados')

            this.logger.debug('Mapeando filas a entidad modelo User')
            return this.mapRowToEntity(rows[0])
        } catch (error) {
            this.logger.error(`Error al insertar los datos en la DB: ${error.message}`)
            throw new Error('Error al insertar datos de usuario')
        }
    }
}