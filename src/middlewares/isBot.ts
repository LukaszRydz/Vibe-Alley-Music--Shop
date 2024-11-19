import express from 'express'

import { BOT } from '../helpers/variables'
import { getTranslate } from '../translations';

export const isBot = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const key = req.header('key');
    
    if (!key || key !== BOT.KEY) {
        return res.status(401).send({ message: getTranslate('error', 'unauthorized', 'en') });
    }

    next();
}