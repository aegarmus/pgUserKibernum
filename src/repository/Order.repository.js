import { query } from "../config/db.config.js";
import { Order } from "../model/Oder.model.js";
import { User } from "../model/User.model.js";
import { OrderError, ValidatorError } from "../utils/errors.util.js";
import { Logger } from "../utils/Logger.js";
import { UserRepository } from "./User.repository.js";


export class OrderRepository {
    static logger = new Logger('ORDER_REPO')

    static mapRowToEntity(row) {
        if(!row) return null
        
        try {
            this.logger.debug('Mapeando filas a entidad modelo Order')
            return new Order({
                id: row.id,
                userId: row.user_id,
                title: row.title,
                description: row.description,
                amount: row.amount,
                status: row.status,
                orderDate: row.order_date,
                active: row.active,
                createdAt: row.created_at,
                updatedAt: row.updated_at,
                deletedAt: row.deleted_at
                
            })
        } catch (error) {
            this.logger.error('Error mapeando filas a entidad modelo Order', error)
            throw new OrderError('Error al realizar la conversión de filas a entidad Order', error.message)
        }
    }
    
    static mapRowToEntityWithUser(row) {
        if(!row) return null

        const order = this.mapRowToEntity(row)
        const user = new User({
            id: row.user_id,
            name: row.user_name,
            lastname: row.user_lastname,
            email: row.user_email,
            phone: row.user_phone,
            birthdate: row.user_birthdate,
            budget: row.user_budget,
            active: row.user_active,
            createdAt: row.user_created_at,
            updatedAt: row.user_updated_at,
            deletedAt: row.user_deleted_at
        })

        return {
            ...order.toFullObject(),
            user: user.toObject()
        }

    }

    static async create(order) {
        try {
            const sql = `
                INSERT INTO orders (
                    id, user_id, title, description, amount, status, order_date, active, deleted_at
                ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
                RETURNING *;
            `

            const values = [
                order.id,
                order.userId,
                order.title,
                order.description,
                order.amount,
                order.status,
                order.orderDate,
                order.active,
                order.deletedAt
            ]

            this.logger.info('Inicializando consulta de inserción de datos')
            const { rows } = await query(sql, values) 
            this.logger.info('Datos insertados')

            return this.mapRowToEntity(rows[0])
        } catch (error) {
            this.logger.error('Error creando la orden en la DB', error)
            throw new OrderError('Error al crear la orden en la DB', error.message)
        }
    }

    static async findAll( { includeDeleted = false } = {}) {
        try {
            const sqlBase = `
                SELECT
                    id, user_id, title, description, amount, status, order_date, active, created_at, updated_at, deleted_at
                FROM orders
            `

            const sql = includeDeleted
                ? `${sqlBase} ORDER BY created_at DESC;`
                : `${sqlBase} WHERE active = true AND deleted_at IS NULL ORDER BY created_at DESC;`

            this.logger.info('Inicializando consulta para obtener todas las ordenes')
            const { rows } = await query(sql)
            this.logger.info('Consulta ejecutada, mapeando resultados a entidad modelo Order') 
            
            return rows.map(row => this.mapRowToEntity(row))
        } catch (error) {
            this.logger.error('Error al obtener las ordenes', error)
            throw new OrderError('Error al obtener las ordenes', error.message)
        }
    }

    static async findAllWithUser({ includeDeleted = false } = {}) {
        try {
            const sqlBase = `
                SELECT
                    o.id, 
                    o.user_id, 
                    o.title, 
                    o.description, 
                    o.amount,
                    o.status, 
                    o.order_date, 
                    o.active, 
                    o.created_at, 
                    o.updated_at,
                    o.deleted_at, 
                    u.name AS user_name, 
                    u.lastname AS user_lastname, 
                    u.email AS user_email, 
                    u.phone AS user_phone, 
                    u.birthdate AS user_birthdate,
                    u.budget AS user_budget, 
                    u.active AS user_active, 
                    u.created_at AS user_created_at, 
                    u.updated_at AS user_updated_at, 
                    u.deleted_at AS user_deleted_at
                FROM orders o
                JOIN users u ON o.user_id = u.id
            `

            const sql = includeDeleted
                ? `${sqlBase} ORDER BY o.created_at DESC;`
                : `${sqlBase} WHERE o.active = true AND u.active = true ORDER BY o.created_at DESC;`

            this.logger.info('Inicializando consulta JOIN para obtener ordenes y usuarios')
            const { rows } = await query(sql)
            this.logger.info('Ordenes de usuario recuperadas con éxito')

            return rows.map(row => this.mapRowToEntityWithUser(row))
        } catch (error) {
            this.logger.error("Error al obtener las ordenes ccon usuarios", error);
            throw new OrderError("Error al obtener las ordenes con usuarios", error.message);
        }
    }

    static async createOrderAndChargeUser(orderData) {
        try {
            this.logger.info('Iniciando transacción: Crear orden y cargar al usuario')
            await query('BEGIN')

            // 1 -> Verificar que el usuario tiene fondos y que esten listos para actualizar
            const userCheckSql = `
                SELECT
                    id, name, lastname, email, phone, birthdate, budget, active, created_at, updated_at, deleted_at
                FROM users 
                WHERE id = $1 AND active = true AND deleted_at IS NULL
                FOR UPDATE
            `;

            this.logger.info('Inicializando consulta de verificación de usuario')
            const userResult = await query(userCheckSql, [ orderData.userId ])

            const user = userResult.rows[0]
            const currentBudget = user.budget
            const orderAmount = orderData.amount

            if(currentBudget < orderAmount) {
                throw new ValidatorError(`Fondos insuficientes: 
                    Fondo actual: ${currentBudget}
                    Monto Requerido: ${orderAmount}    
                `)
            }

            this.logger.debug('Usuario verificado con fondos suficientes')

            // 2 -> Crear la Orden de compra

            const inserOrderSql = `
                INSERT INTO orders (
                    id, user_id, title, description, amount, status, order_date, active, deleted_at
                ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
                RETURNING *;
            `

            const orderValues = [
                orderData.id,
                orderData.userId,
                orderData.title,
                orderData.description,
                orderData.amount,
                'completed',
                orderData.orderDate,
                orderData.active,
                orderData.deletedAt,
            ];

            this.logger.info('Inicializando creación de recibo')
            const orderResult = await query(inserOrderSql, orderValues)
            this.logger.debug('Orden creada con éxito')

            // 3 -> Actualizar fondos del usuario
            const newBudget = currentBudget - orderAmount;
            const updateUserSql = `
                UPDATE users
                SET budget = $1, updated_at = NOW()
                WHERE id = $2
                RETURNING *;
            `

            const updateValues = [ newBudget, orderData.userId ]

            this.logger.info('Inicializando actualización de fondos del usuario')
            const userUpdatedResult = await query(updateUserSql, updateValues)
            this.logger.debug('Fondos de usuario actualizados')

            //4 -> Confirmar transacción
            await query('COMMIT')
            this.logger.info('Transacción completada con éxito')

            // 5 -> Mapear resultados
            this.logger.info('Mapeando información del recibo y usuario')
            const createdOrder = this.mapRowToEntity(orderResult.rows[0])
            const updatedUser = UserRepository.mapRowToEntity(userUpdatedResult.rows[0])
            this.logger.info('Mapeo de datos realizado con éxito')

            return {
                order: createdOrder.toObject(),
                user: updatedUser.toObject(),
                transactionSummary: {
                    previousBudget: currentBudget,
                    chargedAmount: orderAmount,
                    newBudget
                }
            }
        } catch (error) {
            this.logger.warn('Error detectado iniciando Rollback')
            await query('ROLLBACK')
            this.logger.warn('Transacción revertida!')

            this.logger.error('Error al crear una orden y la carga al usuario')
            throw new OrderError('Error al procesar la orden con cargo', error.message)
        }
    }
}   