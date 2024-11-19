import { getTranslate } from '../../translations';
import { getProductsByIds, Product } from '../../database/schemas/product';
import express from 'express'

const _MAX_LIMIT = 50;          // Maximum number of products that can be requested at once
const _AVAILABLE_SORTS = ["title", "release", "discount", "price", "duration",];


export const getProductsFullInfo = async (req: express.Request, res: express.Response) => {    
    const ids = req.query.ids ? [].concat(req.query.ids) : [];
    const lang = (req.headers['Accept-Language']?.[0] || 'en');

    if (!ids) {
        return res.status(400).send({ message: getTranslate('error', 'missingFields', lang) });
    }

    if (ids.length > _MAX_LIMIT) {
        return res.status(400).send({ message: getTranslate('error', 'maxLimit', lang, { max: _MAX_LIMIT }) });
    }

    try {
        const products = await getProductsByIds(ids);

        return res.status(200).send(products);
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: getTranslate('error', 'failedToGetProducts', lang) });
    }
    
}

export const getProducts = async (req: express.Request, res: express.Response) => {
    const { inputQuery, genres, price, options, sort }: IGgetProductsBody = req.query as any;
    const { page = 1 } = req.query;
    const lang = (req.headers['Accept-Language']?.[0] || 'en');
    const limit: number = parseInt(req.query.limit as string) || _MAX_LIMIT;
    const maxPrice = parseFloat(price?.max || '0');
    const minPrice = parseFloat(price?.min || '0');
    const pageNum = parseInt(page as string);
    const _MAX_PAGE = 100;

    const filters: any = {};

    if (limit < 1 || limit > _MAX_LIMIT) {
        return res.status(400).send({ message: getTranslate('error', 'invalidLimit', lang, { min: 1, max: _MAX_LIMIT }) });
    }

    if (pageNum < 1 || pageNum > _MAX_PAGE) {
        return res.status(400).send({ message: getTranslate('error', 'invalidPageNumber', lang, { min: 1, max: _MAX_PAGE }) });
    }

    if (sort?.type && !_AVAILABLE_SORTS.includes(sort.type)) {
        return res.status(400).send({ message: getTranslate('error', 'invalidSortType', lang) });
    }

    if (sort?.order && !['asc', 'desc'].includes(sort.order)) {
        return res.status(400).send({ message: getTranslate('error', 'invalidSortOrder', lang) });
    }

    if (inputQuery) {
        filters.$or = [
            { title: { $regex: inputQuery, $options: 'i' } },
            { tracks: { $elemMatch: { $regex: inputQuery, $options: 'i' } } },
            { artists: { $elemMatch: { $regex: inputQuery, $options: 'i' } } }
        ];
    }
    
    if (genres && genres.length > 0) {
        filters.genres = { 
            $in: genres.map(genre => new RegExp(genre, 'i'))
        };
    }
    
    if (minPrice && maxPrice && minPrice > maxPrice) {
        return res.status(400).send({ message: getTranslate('error', 'invalidPriceRange', lang) });
    }    
    
    if (minPrice > 0) {
        filters.price = { ...filters.price, $gte: minPrice };
    }
    
    if (maxPrice > 0) {
        filters.price = { ...filters.price, $lte: maxPrice};
    }

    if (options) {   
        if ('discount' in options && String(options.discount) === 'true') {
            filters.discount = { ...filters.discount, $gt: 0 };
        }
        
        if ('available' in options && String(options.available) === 'true') {
            filters.quantity = { ...filters.quantity, $gt: 0 };
        }
    }
    
    const sortOptions: any = {};
    if (sort?.type && sort?.order) {
        if (sort.type === 'release') {
            sort.type = 'releaseDate';
        } else if (sort.type === 'duration') {
            sort.type = 'tracks';
        }

        sortOptions[sort.type] = sort.order === 'asc' ? 1 : -1;
    }

    try {
        const products = await Product.find(filters)
        .skip((pageNum - 1) * limit)
        .limit(limit)
        .sort(sortOptions)
        .select('title price _id images.medium discount quantity releaseDate tracks')
        
        const totalProducts = await Product.countDocuments(filters);
                
        return res.status(200).send({
            products,                                               // array of products - title, price, _id, images.small, discount
            currentPage: pageNum,                                   // current page - This is the page number that was requested
            totalPages: Math.ceil(totalProducts / limit),           // total pages - This is the total number of pages available
            totalProducts                                           // total products - This is the total number of products that match the filters
        })
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: getTranslate('error', 'failedToGetProducts', lang) });
    }
}

export const getCartProducts = async (req: express.Request, res: express.Response) => {
    const { cartItems } : { cartItems: [{ id: string, quantity: number}] } = req.query as any;
    const lang = (req.headers['Accept-Language']?.[0] || 'en');

    if (!cartItems) {
        return res.status(400).send({ message: getTranslate('error', 'missingFields', lang) });
    }

    const ids = cartItems.map(item => item.id);

    try {
        const products = await Product.find({ _id: { $in: ids } }).select('title price _id images.small quantity discount');

        const cartProducts = products.map(product => {
            const cartItem = cartItems.find(item => item.id === product._id.toString());

            return {
                ...product.toObject(),
                quantityInCart: cartItem?.quantity || 0
            }
        });

        return res.status(200).send(cartProducts);
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: getTranslate('error', 'failedToGetProducts', lang) });
    }
}

export const getCheckoutProducts = async (req: express.Request, res: express.Response) => {
    const { cartItems } : { cartItems: [{ id: string, quantity: number}] } = req.query as any;    
}

interface IGgetProductsBody {
    inputQuery?: string,
    
    genres?: Array<string>,
    price?: {
        min: string | undefined,
        max: string | undefined
    },
    options?: {
        discount: boolean | undefined,
        available: boolean | undefined
    },
    sort?: { type: string, order: string }
}