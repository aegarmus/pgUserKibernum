import { Order } from "../../model/Oder.model.js";
import { OrderRepository } from "../../repository/Order.repository.js";
import { OrderError } from "../../utils/errors.util.js";
import { Logger } from "../../utils/Logger.js";


export class OrderService {
    static logger = new Logger('ORDER_SERVICE')

    static async create(data) {
        try {
            this.logger.debug('Inicializando instancia del modelo', data)
            const orderData = new Order({
                userId: data.userId,
                title: data.title,
                description: data.description,
                amount: data.amount,
            })

            this.logger.debug('Data instanciada con éxito', orderData.toFullObject())

            this.logger.info('Creando registro en la base de datos')
            const order = await OrderRepository.create(orderData)
            this.logger.debug('Data de ordenes creada en la db', order.toFullObject())
            this.logger.info('ordenes creado con éxito')
            
            return order.toObject()
        } catch (error) {
            this.logger.error('Error al registrar ordenes', error)
            throw new OrderError('Error al registrar el ordenes', error.message)
        }
    }

    static async createOrderAndChargeUser(data) {
        try {
            this.logger.info('Iniciando Servicio de creación de recibo y cargo al usuario')

            this.logger.debug('Inicializamos modelo de ingreso de datos')

            const orderData = new Order({
                userId: data.userId,
                title: data.title,
                description: data.description,
                amount: data.amount,
            });

            this.logger.debug('Data instanciada con éxito', orderData.toFullObject())

            this.logger.info("Creando registro en la base de datos");
            const result = await OrderRepository.createOrderAndChargeUser(orderData)
            this.logger.info('Transacción completada exitosamente desde el servicio')

            return result
        } catch (error) {
            this.logger.error('Error al registrar ordenes', error)
            throw new OrderError('Error al registrar el ordenes', error.message)
        }
    }

    static async findAll() {
        try {
            this.logger.info('Inicializando busqueda de ordeness')
            const order = await OrderRepository.findAll()
            this.logger.debug('ordeness encontrados con éxito')

            const ordersObject = order.map(user => user.toObject())

            return ordersObject
        } catch (error) {
            this.logger.error("Error al encontrar los ordeness", error);
            throw new OrderError("Error al encontrar los ordeness", error.message);
        }
    }

    static async findAllWithUser() {
        try {
            this.logger.info("Inicializando busqueda de ordenes con usuarios");
            const order = await OrderRepository.findAllWithUser();
            this.logger.debug("ordenes con usuarios encontrados con éxito");

            return order
        } catch (error) {
            this.logger.error('Error al encontrar ordenes con usuarios', error)
            throw new OrderError('Error al encontrar las ordenes con usuarios', error.message)
        }
    }

    static async findAllWithDeleted() {
        try {
            this.logger.info("Inicializando busqueda de ordeness");
            const order = await OrderRepository.findAll({ includeDeleted: true });
            this.logger.debug("ordeness encontrados con éxito");

            const ordersObject = order.map((user) => order.toFullObject());

            return ordersObject;
        } catch (error) {
            this.logger.error("Error al encontrar los ordeness", error);
            throw new OrderError("Error al encontrar los ordeness", error.message);
        }
    }

    static async findById(id) {
        try {
            this.logger.info(`Inicializando busqueda de ordeness con id: ${id}`);
            const order = await OrderRepository.findById(id)
            this.logger.debug(`ordeness con id ${id} encontrados con éxito`);
            return order.toObject()
        } catch (error) {
            this.logger.error(`Error al encontrar el ordenes con id ${id}`, error);
            throw new OrderError(`Error al encontrar el ordenes con id ${id}`, error.message);
        }
    }

    static async findByIdWithDeleted(id) {
        try {
            this.logger.info(`Inicializando busqueda de ordeness con id: ${id}`);
            const order = await OrderRepository.findById(id, { includeDeleted: true })
            this.logger.debug(`ordeness con id ${id} encontrados con éxito`);
            return order.toFullObject()
        } catch (error) {
            this.logger.error(`Error al encontrar el ordenes con id ${id}`, error);
            throw new OrderError(`Error al encontrar el ordenes con id ${id}`, error.message);
        }
    }

    static async update(id, data) {
        try {
            this.logger.debug('Comprobando ordenes para actualizar')
            const order = await OrderRepository.findById(id)

            if(!user) throw new OrderError('ordenes no encontrado', `No encontramos al ordenes con id: ${id}`, 404)
            
            this.logger.debug('ordenes encontrado con éxito')
            this.logger.info('Inicializando actualización')
            user.update(data)

            const orderUpdated = await OrderRepository.update(id, {
                name: user.name,
                lastname: user.lastname,
                email: user.email,
                phone: user.phone,
                birthdate: user.birthdate,
                budget: user.budget
            })

            this.logger.info('ordenes actualizado con éxito')

            return orderUpdated.toObject()

        } catch (error) {
            this.logger.error(`Error al actualizar el ordenes con id ${id}`, error);
            throw new OrderError(`Error al actualizar el ordenes con id ${id}`, error.message);
        }
    }

    static async permaDelete(id) {
        try {
            this.logger.debug("Comprobando ordenes para actualizar");
            const order = await OrderRepository.findById(id);

            if (!order) throw new OrderError("ordenes no encontrado", `No encontramos al ordenes con id: ${id}`, 404);

            this.logger.info('Inicializando eliminación')
            const deletedOrder = await OrderRepository.permaDelete(id)
            this.logger.info('ordenes eliminado con éxito')

            return deletedOrder.toObject()
        } catch (error) {
            this.logger.error(`Error al eliminar el ordenes con id ${id}`, error);
            throw new OrderError(`Error al eliminar el ordenes con id ${id}`, error.message);
        }
    }

    static async softDelete(id) {
        try {
            this.logger.debug('Comprobando ordenes para eliminar')
            const order = await OrderRepository.findById(id);

            if(!order) throw new OrderError('ordenes no encontrado', `No encontramos al ordenes con el id: ${id}`, 404) 

            this.logger.info('Inicializando Eliminación')
            const deletedOrder = await OrderRepository.softDelete(id);
            this.logger.info('ordenes eliminado logicamente con exito')

            return deletedOrder.toObject()
        } catch (error) {
            this.logger.error(`Error al eliminar el ordenes con id ${id}`, error);
            throw new OrderError(`Error al eliminar el ordenes con id ${id}`, error.message);
        }
    }

    static async restore(id) {
        try {
            this.logger.debug('Comprobando ordenes para restaurar')
            const order = await OrderRepository.findById(id, { includeDeleted: true });

            if(!order) throw new OrderError('ordenes no encontrado', `No encontramos al ordenes con el id: ${id}`, 404) 

            this.logger.info('Inicializando restauración')
            const deletedOrder = await OrderRepository.restore(id);
            this.logger.info('ordenes restaurado con exito')

            return deletedOrder.toObject()
        } catch (error) {
            this.logger.error(`Error al restaurar el ordenes con id ${id}`, error);
            throw new OrderError(`Error al restaurar el ordenes con id ${id}`, error.message);
        }
    }
}