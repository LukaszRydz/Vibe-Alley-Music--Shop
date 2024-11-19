import express from 'express';

import { sendMessage } from '../controllers/client/message';
import { ipLimiter } from '../middlewares/ipLimiter';

export default (router: express.Router) => {
    router.post('/message', ipLimiter(1, 24 * 60 * 60 * 1000, 'Too many messages, please try again after 24 hours'), sendMessage);
}