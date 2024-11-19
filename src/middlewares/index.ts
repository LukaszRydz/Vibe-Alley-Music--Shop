import express from 'express'
import { getTranslate } from '../translations';
import { Host } from '../helpers/variables';

import helmet from "helmet";
import cors from 'cors'
import bodyParser from 'body-parser'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import { rateLimit } from 'express-rate-limit'

const logs = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.info(`${req.method} ${req.originalUrl}`)
    next()
}

// Global middlewares
export const initMiddlewares = (app: express.Application) => {
    app.use(logs)
    app.use(helmet())
    app.use(rateLimit({
        windowMs: 15 * 60 * 1000,     // 15 minutes
        max: 400,                     // limit each IP in this time window
        message: getTranslate('error', 'rateLimit', 'en')
    }))
    app.use(cors({ 
        credentials: true,
        origin: [Host.FRONT, Host.CLIENT],
        exposedHeaders: ['show-success'],
    }))
    app.use(bodyParser.json())
    app.use(cookieParser())
    app.use(compression({
        level: 6, 
        threshold: 1024,
    }));
}    