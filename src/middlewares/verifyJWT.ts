import express from 'express'
import jwt from 'jsonwebtoken'
import { JwtPayload } from 'jsonwebtoken'

import { JWT } from '../helpers/variables'
import { getTranslate } from '../translations'

export const verifyJWT = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const token = req.cookies[JWT.COOKIE_NAME];
    if (!token) {
        return res.status(401).send(getTranslate('error', 'tokenNotFound', 'en'));
    }

    const now = Math.floor(Date.now() / 1000);
    const expired = (jwt.decode(token) as JwtPayload).exp;

    try {
        if (expired && expired <= now) {
            res.clearCookie(JWT.COOKIE_NAME);
            return res.status(401).send(getTranslate('error', 'tokenExpired', 'en'));
        }

        const decoded = jwt.verify(token, JWT.SECRET);
        if (!decoded) {
            return res.status(401).send('Error verifying token');
        }

        res.locals.token = decoded;
        next();
    } catch (error) {
        console.log(error)
        return res.status(401).send(getTranslate('error', 'unknown', 'en'));
    }
}