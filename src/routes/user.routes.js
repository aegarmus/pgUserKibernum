import { Router } from 'express'
import { UserController } from '../controller/User.controller.js'

const router = Router()

router.post('/users', UserController.create)
router.get('/users', UserController.findAll)
router.get('/users/admin', UserController.findAllwithDeleted)
router.get('/users/:id', UserController.findById)
router.get('/users/admin/:id', UserController.findByIdWithDeleted)
router.put('/users/:id',  UserController.update)
router.delete('/users/admin/:id', UserController.permaDelete)
router.delete('/users/:id', UserController.softDelete)
router.patch('/users/:id', UserController.restore)

export default router