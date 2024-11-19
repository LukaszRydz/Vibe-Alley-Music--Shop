import express from 'express';

import { verifyJWT } from '../middlewares/verifyJWT';
import { isEmployee } from '../middlewares/isEmployee';
import { getCartProducts, getProductsFullInfo, getProducts } from '../controllers/client/product';
import { createProduct, addQuantity, updateProductData, addDiscounts } from '../controllers/admin/product'
import { getAlbumByName, getAlbumsByArtist, getNewestAlbums } from '../controllers/bot/products';
import { isBot } from '../middlewares/isBot';

export default (router: express.Router) => {
    //  !Admin actions
    router.post('/admin/product/create', verifyJWT, isEmployee, createProduct);
    router.post('/admin/product/add-quantity', verifyJWT, isEmployee, addQuantity);
    router.post('/admin/product/update', verifyJWT, isEmployee, updateProductData);
    router.post('/admin/product/add-discounts', verifyJWT, isEmployee, addDiscounts);

    // !Client actions
    router.get('/client/product/products-full-info', getProductsFullInfo);
    router.get('/client/products-page', getProducts);
    router.get('/client/product/cart', getCartProducts);

    // !Bot actions
    router.get('/bot/product/album-by-name', isBot, getAlbumByName);
    router.get('/bot/product/albums-by-artist', isBot, getAlbumsByArtist);
    router.get('/bot/product/newest-albums', isBot, getNewestAlbums);
}