import { Router } from 'express'
import { UserController } from '../controller/User.controller.js'

const router = Router()

router.post('/users', UserController.create)
router.get('/users', UserController.findAll)
router.get('/users/admin', UserController.findAllwithDeleted)

export default router