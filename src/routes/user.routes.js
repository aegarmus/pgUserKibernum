import { Router } from 'express'
import { UserController } from '../controller/User.controller.js'

const router = Router()

router.post('/', UserController.create)
router.get('/', UserController.findAll)
router.get('/admin', UserController.findAllwithDeleted)
router.get('/:id', UserController.findById)
router.get('/admin/:id', UserController.findByIdWithDeleted)
router.put('/:id',  UserController.update)
router.delete('/admin/:id', UserController.permaDelete)
router.delete('/:id', UserController.softDelete)
router.patch('/:id', UserController.restore)

export default router