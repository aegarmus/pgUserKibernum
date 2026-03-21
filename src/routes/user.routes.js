import { Router } from 'express'
import { UserController } from '../controller/User.controller.js'

const router = Router()

router.post('/users', UserController.create)

export default router