import { UserService } from "../service/users/User.service.js";


export class UserController {
    static async create(req, res, next) {
        try {
            const data = await UserService.create(req.body)

            res.status(201).json({
                message: 'Usuario creado con éxito',
                statusCode: 201,
                data
            })
        } catch (error) {
            next(error)
        }
    }

    static async findAll(req, res, next) {
        try {
            const data = await UserService.findAll()
            res.status(200).json({
                message: 'Usuarios encontrados con éxito',
                statusCode: 200,
                data
            })
        } catch (error) {
            next(error)
        }
    }

    static async findAllwithDeleted(req, res, next) {
        try {
            const data = await UserService.findAllWithDeleted()
            res.status(200).json({
                message: 'Usuarios encontrados con éxito',
                statusCode: 200,
                data
            })
        } catch (error) {
            next(error)
        }
    }

    static async findById(req, res, next) {
        try {
            const data = await UserService.findById(req.params.id)
            res.status(200).json({
                message: 'Usuario encontrado con éxito',
                statusCode: 200,
                data
            })
        } catch (error) {
            next(error)
        }
    }

    static async findByIdWithDeleted(req, res, next) {
        try {
            const data = await UserService.findByIdWithDeleted(req.params.id)
            res.status(200).json({
                message: 'Usuario encontrado con éxito',
                statusCode: 200,
                data
            })
        } catch (error) {
            next(error)
        }
    }

    static async update(req, res, next) {
        try {
            const data = await UserService.update(req.params.id, req.body)
            res.status(200).json({
                message: 'Usuario actualizado con éxito',
                statusCode: 200,
                data
            })
        } catch (error) {
            next(error)
        }
    }

    static async permaDelete(req, res, next) {
        try {
            const data = await UserService.permaDelete(req.params.id)
            res.status(200).json({
                message: 'Usuario eliminado con éxito',
                statusCode: 200,
                data
            })
        } catch (error) {
            next(error)
        }
    }
}