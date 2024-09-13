import express from 'express';

import { verifyJWT } from '../middlewares/verifyJWT';
import { isEmployee } from '../middlewares/isEmployee';
import { createProduct } from '../controllers/product';

export default (router: express.Router) => {
    router.post('/admin/product/create', verifyJWT, isEmployee, createProduct);
}