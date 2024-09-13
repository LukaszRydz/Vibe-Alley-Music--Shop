import express from 'express'

import { Api } from '../helpers/variables'
import product from './product'

export const initRouter = (app: express.Application) => {
    const router = express.Router()
    
    product(router)

    app.use(`/${Api.VERSION}`, router)
}
