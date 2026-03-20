import pkg from 'pg'
import { env } from './env.config.js'
const { Pool } = pkg

const { db } = env

const pool = new Pool({
    //Tiene que recibir información sensible
    host: db.host,
    port: db.port,
    user: db.user,
    password: db.password,
    database: db.database
})

// const pool = new Pool(db) objeto db es identico al config de Pool


/**
 * Esta función ejecuta la query que se entregue por text en base a los valores de params
 * @param {string} text - Estructura en formato string de la query que se quiere ejecutar en DB
 * @param {Array<any>} params - Lista de datos que se van a implementar en la query 
 * @returns 
 */
export const query = (text, params) => pool.query(text, params)