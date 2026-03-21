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
            res.status(500).json({
                message: 'Error al crear el usuario',
                statusCode: 500,
                error
            })
        }
    }
}