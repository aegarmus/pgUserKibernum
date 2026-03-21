import { User } from "../../model/User.model.js";
import { UserRepository } from "../../repository/User.repositroy.js";
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
            throw new Error('Error al registrar el usuario')
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
            throw new Error("Error al encontrar los usuarios");
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
            throw new Error("Error al encontrar los usuarios");
        }
    }
}