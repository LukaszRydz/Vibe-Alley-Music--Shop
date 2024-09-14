import express from 'express';

import { verifyJWT } from '../middlewares/verifyJWT';
import { isEmployee } from '../middlewares/isEmployee';
import { createProduct, addQuantity, updateProductData, addDiscounts, getFullProductsInfo, getProductsPage } from '../controllers/product';

export default (router: express.Router) => {
    //  !Admin actions
    router.post('/admin/product/create', verifyJWT, isEmployee, createProduct);
    router.post('/admin/product/add-quantity', verifyJWT, isEmployee, addQuantity);
    router.post('/admin/product/update', verifyJWT, isEmployee, updateProductData);
    router.post('/admin/product/add-discounts', verifyJWT, isEmployee, addDiscounts);

    // !Client actions
    router.get('/client/product/products-full-info', getFullProductsInfo);
    router.get('/client/products-page', getProductsPage);
}