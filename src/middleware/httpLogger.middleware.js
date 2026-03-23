import { performance } from 'node:perf_hooks'
import { Logger } from '../utils/Logger.js'


const logger = new Logger('HTTP')

export const httpLogger = (req, res, next) => {
    const start = performance.now()

    res.on('finish', () => {
        const duration = `${Math.round(performance.now() - start)}ms`;
        const message = `${req.method} ${req.originalUrl} ${res.statusCode} +${duration}`

        if(res.statusCode >= 500) {
            logger.error(message)
            return;
        }

        if(res.statusCode >= 400) {
            logger.warn(message)
            return;
        }

        logger.info(message)
    })

    next()
} 