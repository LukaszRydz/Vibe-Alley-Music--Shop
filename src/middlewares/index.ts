import express from 'express'

import helmet from "helmet";
import cors from 'cors'
import bodyParser from 'body-parser'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import { rateLimit } from 'express-rate-limit'

// Global middlewares
export const initMiddlewares = (app: express.Application) => {
    app.use(helmet())
    app.use(rateLimit({
        windowMs: 15 * 60 * 1000,    // 15 minutes
        max: 100,                    // limit each IP in this time window
        message: 'Too many requests from this IP, please try again after 15 minutes'
    }))
    app.use(cors({ credentials: true }))
    app.use(bodyParser.json())
    app.use(cookieParser())
    app.use(compression())
}    