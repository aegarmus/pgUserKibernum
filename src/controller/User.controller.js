import { UserService } from "../service/users/User.service.js";


export class UserController {
    static async create(req, res) {
        try {
            const data = await UserService.create(req.body)

            res.status(201).json({
                message: 'Usuario creado con éxito',
                statusCode: 201,
                data
            })
        } catch (error) {
            next()
        }
    }

    static async findAll(req, res) {
        try {
            const data = await UserService.findAll()
            res.status(200).json({
                message: 'Usuarios encontrados con éxito',
                statusCode: 200,
                data
            })
        } catch (error) {
            next()
        }
    }

    static async findAllwithDeleted(req, res) {
        try {
            const data = await UserService.findAllWithDeleted()
            res.status(200).json({
                message: 'Usuarios encontrados con éxito',
                statusCode: 200,
                data
            })
        } catch (error) {
            next()
        }
    }
}