import express from 'express'
import healthRoutes from './healthRoutes.js'
import userRoutes from './userRoutes.js'

const router = express.Router()

router.use('/api/health', healthRoutes)
router.use('/api/users', userRoutes)

export default router
