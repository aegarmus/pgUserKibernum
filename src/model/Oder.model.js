
import { ValidatorError } from "../utils/errors.util.js";

export class Order {
    #id
    #userId
    #title
    #description
    #amount
    #status
    #orderDate
    #active
    #createdAt
    #updatedAt
    #deletedAt

    constructor({
        id = crypto.randomUUID(),
        userId,
        title,
        description = null,
        amount,
        status = 'pending',
        orderDate = null,
        active = true,
        createdAt = null,
        updatedAt = null,
        deletedAt = null
    }) {
        if(!userId || !title || !amount) {
            throw new ValidatorError('userId, title y amount son obligatorios')
        }

        if(Number(amount) <= 0) {
            throw new ValidatorError('El amount debe ser mayor a 0')
        }

        const validStatuses = ['pending', 'processing', 'completed', 'cancelled', 'refunded']
        if(!validStatuses.includes(status)) {
            throw new ValidatorError('Status debe ser uno de: ' + validStatuses.join(', '))
        }

        this.#id = id
        this.#userId = userId
        this.#title = title
        this.#description = description
        this.#amount = Number(amount)
        this.#status = status
        this.#orderDate = orderDate || new Date()
        this.#active = active
        this.#createdAt = createdAt || new Date()
        this.#updatedAt = updatedAt || new Date()
        this.#deletedAt = deletedAt
    }

    // Getters
    get id() { return this.#id }
    get userId() { return this.#userId }
    get title() { return this.#title }
    get description() { return this.#description }
    get amount() { return this.#amount }
    get status() { return this.#status }
    get orderDate() { return this.#orderDate }
    get active() { return this.#active }
    get createdAt() { return this.#createdAt }
    get updatedAt() { return this.#updatedAt }
    get deletedAt() { return this.#deletedAt }

    update(fields = {}) {
        if(fields.title !== undefined) this.#title = fields.title
        if(fields.description !== undefined) this.#description = fields.description
        if(fields.amount !== undefined) {
            if(Number(fields.amount) <= 0) {
                throw new ValidatorError('Amount debe ser mayor a 0')
            }
            this.#amount = Number(fields.amount)
        }
        if(fields.status !== undefined) {
            const validStatuses = ['pending', 'processing', 'completed', 'cancelled', 'refunded']
            if(!validStatuses.includes(fields.status)) {
                throw new ValidatorError('Status debe ser uno de: ' + validStatuses.join(', '))
            }
            this.#status = fields.status
        }
        if(fields.orderDate !== undefined) this.#orderDate = fields.orderDate
        
        this.#updatedAt = new Date()
    }

    softDelete(){
        this.#active = false
        this.#deletedAt = new Date()
        this.#updatedAt = new Date()
    }

    restore() {
        this.#active = true
        this.#deletedAt = null
        this.#updatedAt = new Date()
    }

    // Cambiar status de la orden
    updateStatus(newStatus) {
        const validStatuses = ['pending', 'processing', 'completed', 'cancelled', 'refunded']
        if(!validStatuses.includes(newStatus)) {
            throw new ValidatorError('Status debe ser uno de: ' + validStatuses.join(', '))
        }
        this.#status = newStatus
        this.#updatedAt = new Date()
    }

    // Verificar si la orden está completada
    isCompleted() {
        return this.#status === 'completed'
    }

    // Verificar si la orden puede ser cancelada
    canBeCancelled() {
        return ['pending', 'processing'].includes(this.#status)
    }

    toFullObject() {
        return {
            id: this.#id,
            userId: this.#userId,
            title: this.#title,
            description: this.#description,
            amount: this.#amount,
            status: this.#status,
            orderDate: this.#orderDate,
            active: this.#active,
            createdAt: this.#createdAt,
            updatedAt: this.#updatedAt,
            deletedAt: this.#deletedAt
        }
    }

    toObject() {
        return {
            id: this.#id,
            userId: this.#userId,
            title: this.#title,
            description: this.#description,
            amount: this.#amount,
            status: this.#status,
            orderDate: this.#orderDate
        }
    }
}