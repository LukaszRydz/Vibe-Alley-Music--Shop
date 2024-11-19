import express from 'express';

import { verifyJWT } from '../middlewares/verifyJWT';
import { createPaymentIntent } from '../controllers/payment/payment';
import { isClient } from '../middlewares/isClient';

export default (router: express.Router) => {
    router.post('/payment/create-checkout-session', verifyJWT, isClient, createPaymentIntent);
}   