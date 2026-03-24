import { OrderService } from "../service/orders/Order.service.js";


export class OrderController {
    static async create(req, res, next) {
        try {
            const data = await OrderService.create(req.body)

            res.status(201).json({
                message: 'Recibo creado con éxito',
                statusCode: 201,
                data
            })
        } catch (error) {
            next(error)
        }
    }

    static async findAll(req, res, next) {
        try {
            const data = await OrderService.findAll()
            res.status(200).json({
                message: 'Recibos encontrados con éxito',
                statusCode: 200,
                data
            })
        } catch (error) {
            next(error)
        }
    }

    static async findAllWithUser(req, res, next) {
        try {
            const data = await OrderService.findAllWithUser()

            res.status(200).json({
                message: "Recibos encontrados con éxito",
                statusCode: 200,
                data,
            });
        } catch (error) {
            next(error)
        }
    }

    static async findAllwithDeleted(req, res, next) {
        try {
            const data = await OrderService.findAllWithDeleted()
            res.status(200).json({
                message: 'Recibos encontrados con éxito',
                statusCode: 200,
                data
            })
        } catch (error) {
            next(error)
        }
    }

    static async findById(req, res, next) {
        try {
            const data = await OrderService.findById(req.params.id)
            res.status(200).json({
                message: 'Recibo encontrado con éxito',
                statusCode: 200,
                data
            })
        } catch (error) {
            next(error)
        }
    }

    static async findByIdWithDeleted(req, res, next) {
        try {
            const data = await OrderService.findByIdWithDeleted(req.params.id)
            res.status(200).json({
                message: 'Recibo encontrado con éxito',
                statusCode: 200,
                data
            })
        } catch (error) {
            next(error)
        }
    }

    static async update(req, res, next) {
        try {
            const data = await OrderService.update(req.params.id, req.body)
            res.status(200).json({
                message: 'Recibo actualizado con éxito',
                statusCode: 200,
                data
            })
        } catch (error) {
            next(error)
        }
    }

    static async permaDelete(req, res, next) {
        try {
            const data = await OrderService.permaDelete(req.params.id)
            res.status(200).json({
                message: 'Recibo eliminado con éxito',
                statusCode: 200,
                data
            })
        } catch (error) {
            next(error)
        }
    }

    static async softDelete(req, res, next) {
        try {
            const data = await OrderService.softDelete(req.params.id)
            res.status(200).json({
                message: 'Recibo eliminado con éxito',
                statusCode: 200,
                data
            })
        } catch (error) {
            next(error)
        }
    }

    static async restore(req, res, next) {
        try {
            const data = await OrderService.restore(req.params.id)
            res.status(200).json({
                message: 'Recibo restaurado con éxito',
                statusCode: 200,
                data
            })
        } catch (error) {
            next(error)
        }
    }
}