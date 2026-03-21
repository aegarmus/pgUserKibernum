import { ValidatorError } from "../utils/errors.util.js";

export class User {
    #id;
    #name;
    #lastname;
    #email;
    #phone;
    #birthdate;
    #budget;
    #active;
    #createdAt;
    #updatedAt;
    #deletedAt;

    constructor({
        id = crypto.randomUUID(),
        name,
        lastname,
        email,
        phone = null,
        birthdate = null,
        budget = 0,
        active = true,
        deletedAt = null,
        createdAt = null,
        updatedAt = null
    }) {
        if(!name || !lastname || !email) {
            throw new ValidatorError('name, lastname y/o mail son obligatorios')
        }

        if(Number(budget) < 0) {
            throw new ValidatorError('El budget no puede ser negativo')
        }

        this.#id = id;
        this.#name = name; //TODO: validar
        this.#lastname = lastname;
        this.#email = email;
        this.#phone = phone;
        this.#birthdate = birthdate;
        this.#budget = Number(budget);
        this.#active = active;
        this.#createdAt = createdAt || new Date();
        this.#updatedAt = updatedAt || new Date();
        this.#deletedAt = deletedAt;    
    }

    // Getters
    get id() { return this.#id }
    get name() { return this.#name }
    get lastname() { return this.#lastname }
    get email() { return this.#email }
    get phone() { return this.#phone }
    get birthdate() { return this.#birthdate }
    get budget() { return this.#budget }
    get active() { return this.#active }
    get createdAt() { return this.#createdAt }
    get updatedAt() { return this.#updatedAt }
    get deletedAt() { return this.#deletedAt }

    update(fields = {}) {
        if(fields.name !== undefined) this.#name = fields.name //TODO: validar
        if(fields.lastname !== undefined) this.#lastname = fields.lastname
        if(fields.email !== undefined) this.#email = fields.email
        if(fields.phone !== undefined) this.#phone = fields.phone
        if(fields.birthdate !== undefined) this.#birthdate = fields.birthdate
        if(fields.budget !== undefined) {
            if(Number(fields.budget) < 0) {
                throw new ValidatorError('Budget debe ser superior a 0')
            }

            this.#budget = Number(fields.budget)
        }
    }

    softDelete(){
        this.#active = false;
        this.#deletedAt = new Date().toISOString();
    }

    restore() {
        this.#active = true;
        this.#deletedAt = null
    }

    toFullObject() {
        return {
            id: this.#id,
            name: this.#name,
            lastname: this.#lastname,
            email: this.#email,
            phone: this.#phone,
            birthdate: this.#birthdate,
            budget: this.#budget,
            active: this.#active,
            createdAt: this.#createdAt,
            updatedAt: this.#updatedAt,
            deletedAt: this.#deletedAt
        }
    }

    toObject() {
        return {
            id: this.#id,
            name: this.#name,
            lastname: this.#lastname,
            email: this.#email,
            phone: this.#phone,
            birthdate: this.#birthdate,
            budget: this.#budget
        }
    }
}

