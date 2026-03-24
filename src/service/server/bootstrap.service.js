import express from 'express'
import { Logger } from "../../utils/Logger.js"
import { DB } from "../db/DB.service.js"
import { env } from "../../config/env.config.js"
import appRouter from '../../routes/index.routes.js'
import { httpLogger } from '../../middleware/httpLogger.middleware.js'
import { errorHandler } from '../../middleware/error.middleware.js'

const logger = new Logger('SERVER')
const { app: { port, environment } } = env
const app = express()

export const bootstrap = async (config = {}) => {
    if (environment === 'PROD' ) {
        logger.info('Preparando servidor para producción')
    } else {
        logger.info('Servidor en modo desarrollo')
    }

    app.use(express.json())

    if(config.formFormat) {
        logger.info('Configuración de multi formato activdada')
        app.use(express.urlencoded({ extended: true }))
    }

    if(config.performanceLogger) {
        app.use(httpLogger)
    }

    logger.info('Inicializando rutas')
    app.use('/api/v1', appRouter)

    logger.info('Inicializando manejo de errores')
    app.use(errorHandler)

    try {
        await DB.init()
        app.listen(port, () => {
            logger.info(`Servidor corriendo en el puerto: ${port}`)
        })
    } catch (error) {
        logger.error('Error al inciar el servidor', error)
        process.exit(1)
    }
}