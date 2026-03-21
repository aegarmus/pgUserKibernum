import { AppError, InternalServerError } from '../utils/errors.util.js'
import { Logger } from '../utils/Logger.js'

const logger = new Logger()

export const errorHandler = (err, req, res, next) => {

    if(!(err instanceof AppError)) {
        err = new InternalServerError(
            err.message || 'Error inesperado',
            'Ocurrio un error inesperado que requiere analisis, Contacta al equipo de desarrollo'
        )
    }

    const errorResponse = {
        message: err.message,
        statusCode: err.statusCode,
        error: err.details
    }

    logger.error(err.message)

    res.status(err.statusCode).json(errorResponse)
}