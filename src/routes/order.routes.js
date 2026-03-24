import { Router } from 'express'
import { OrderController } from '../controller/Order.controller.js'

const router = Router()

router.post('/', OrderController.create)
router.get('/', OrderController.findAll)
router.get('/user', OrderController.findAllWithUser)
router.get('/admin', OrderController.findAllwithDeleted)
router.get('/:id', OrderController.findById)
router.get('/admin/:id', OrderController.findByIdWithDeleted)
router.put('/:id',  OrderController.update)
router.delete('/admin/:id', OrderController.permaDelete)
router.delete('/:id', OrderController.softDelete)
router.patch('/:id', OrderController.restore)

export default router