import express from 'express'
import { DB } from './service/db/DB.service.js'

const app = express()

app.use(express.json())

await DB.init()

app.listen(3000, () => console.log(`Servidor corriendo en el puerto 3000`))

