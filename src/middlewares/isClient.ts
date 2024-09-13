import express from 'express'
import axios from 'axios'

import { Endpoints, JWT } from '../helpers/variables'

export const isClient = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const url = Endpoints.AUTH_CLIENT;
    const token = req.cookies[JWT.COOKIE_NAME];

    if (!token) {
        return res.send('Token not find').status(401)  
    }

    try {
        const response = await axios.post(url, {}, { 
            withCredentials: true,
            headers: {
                'Cookie': `${JWT.COOKIE_NAME}=${token}`
            }
        });

        if (response.status !== 200) {
            return res.send('Client not authorized').status(401);
        }

    } catch (error) {
        return res.sendStatus(401);
    }
    
    next();
}