import express from 'express'

import product from './product'
import message from './message'
import payment from './payment'

export const initRouter = (app: express.Application) => {
    const router = express.Router()
    
    product(router)
    message(router)
    payment(router)

    app.use(`/`, router)
}
