import { Router } from 'express'
import userRoutes from './user.routes.js'
import orderRoutes from './order.routes.js'

const router = Router()

router.use('/users', userRoutes)
router.use('/orders', orderRoutes)

export default router