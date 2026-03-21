import { User } from "../../model/User.model.js";
import { UserRepository } from "../../repository/User.repository.js";
import { UserError } from "../../utils/errors.util.js";
import { Logger } from "../../utils/Logger.js";


export class UserService {
    static logger = new Logger('USER_SERVICE')

    static async create(data) {
        try {
            this.logger.debug('Inicializando instancia del modelo', data)
            const userData = new User({
                name: data.name,
                lastname: data.lastname,
                email: data.email,
                phone: data.phone,
                birthdate: data.birthdate,
                budget: data.budget
            })

            this.logger.debug('Data instanciada con éxito', userData.toFullObject())

            this.logger.info('Creando registro en la base de datos')
            const user = await UserRepository.create(userData)
            this.logger.debug('Data de usuario creada en la db', user.toFullObject())
            this.logger.info('Usuario creado con éxito')
            
            return user.toObject()
        } catch (error) {
            this.logger.error('Error al registrar usuario', error)
            throw new UserError('Error al registrar el usuario', error.message)
        }
    }

    static async findAll() {
        try {
            this.logger.info('Inicializando busqueda de usuarios')
            const users = await UserRepository.findAll()
            this.logger.debug('Usuarios encontrados con éxito')

            const usersObject = users.map(user => user.toObject())

            return usersObject
        } catch (error) {
            this.logger.error("Error al encontrar los usuarios", error);
            throw new UserError("Error al encontrar los usuarios", error.message);
        }
    }

    static async findAllWithDeleted() {
        try {
            this.logger.info("Inicializando busqueda de usuarios");
            const users = await UserRepository.findAll({ includeDeleted: true });
            this.logger.debug("Usuarios encontrados con éxito");

            const usersObject = users.map((user) => user.toFullObject());

            return usersObject;
        } catch (error) {
            this.logger.error("Error al encontrar los usuarios", error);
            throw new UserError("Error al encontrar los usuarios", error.message);
        }
    }

    static async findById(id) {
        try {
            this.logger.info(`Inicializando busqueda de usuarios con id: ${id}`);
            const user = await UserRepository.findById(id)
            this.logger.debug(`Usuarios con id ${id} encontrados con éxito`);
            return user.toObject()
        } catch (error) {
            this.logger.error(`Error al encontrar el usuario con id ${id}`, error);
            throw new UserError(`Error al encontrar el usuario con id ${id}`, error.message);
        }
    }

    static async findByIdWithDeleted(id) {
        try {
            this.logger.info(`Inicializando busqueda de usuarios con id: ${id}`);
            const user = await UserRepository.findById(id, { includeDeleted: true })
            this.logger.debug(`Usuarios con id ${id} encontrados con éxito`);
            return user.toFullObject()
        } catch (error) {
            this.logger.error(`Error al encontrar el usuario con id ${id}`, error);
            throw new UserError(`Error al encontrar el usuario con id ${id}`, error.message);
        }
    }

    static async update(id, data) {
        try {
            this.logger.debug('Comprobando usuario para actualizar')
            const user = await UserRepository.findById(id)

            if(!user) throw new UserError('Usuario no encontrado', `No encontramos al usuario con id: ${id}`, 404)
            
            this.logger.debug('Usuario encontrado con éxito')
            this.logger.info('Inicializando actualización')
            user.update(data)

            const userUpdated = await UserRepository.update(id, {
                name: user.name,
                lastname: user.lastname,
                email: user.email,
                phone: user.phone,
                birthdate: user.birthdate,
                budget: user.budget
            })

            this.logger.info('Usuario actualizado con éxito')

            return userUpdated.toObject()

        } catch (error) {
            this.logger.error(`Error al actualizar el usuario con id ${id}`, error);
            throw new UserError(`Error al actualizar el usuario con id ${id}`, error.message);
        }
    }

    static async permaDelete(id) {
        try {
            this.logger.debug("Comprobando usuario para actualizar");
            const user = await UserRepository.findById(id);

            if (!user) throw new UserError("Usuario no encontrado", `No encontramos al usuario con id: ${id}`, 404);

            this.logger.info('Inicializando eliminación')
            const deletedUser = await UserRepository.permaDelete(id)
            this.logger.info('Usuario eliminado con éxito')

            return deletedUser.toObject()
        } catch (error) {
            this.logger.error(`Error al eliminar el usuario con id ${id}`, error);
            throw new UserError(`Error al eliminar el usuario con id ${id}`, error.message);
        }
    }
}