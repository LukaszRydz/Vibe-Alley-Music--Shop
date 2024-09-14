import { getProductsByIds, Product } from './../database/schemas/product';
import { addProduct, updateProduct, updateStock, updateDiscount } from '../database/schemas/product';
import express from 'express'

// !        ===============================
// !                     ADMIN
// !        ===============================
export const createProduct = async (req: express.Request, res: express.Response) => {
    const token = res.locals.token;
    
    if (!token) {
        return res.status(401).send({ message: 'Unauthorized' });
    }
    
    const {
        title,
        label,
        artists,
        genres,
        releaseDate,
        price,
        images,
        spotifyAlbumId,
        quantity,
        discount
    } : IProduct = req.body;

    if (!title || !label || !artists || !genres || !releaseDate || !price || !images || !quantity) {
        return res.status(400).send({ message: 'Missing required fields' });
    }

    // validators
    if (artists.length === 0) {
        return res.status(400).send({ message: 'Artists array cannot be empty' });
    }

    if (genres.length === 0) {
        return res.status(400).send({ message: 'Genres array cannot be empty' });
    }

    if (images.length !== 3) {
        return res.status(400).send({ message: 'Images array must have 3 elements' });
    }

    if (quantity < 0) {
        return res.status(400).send({ message: 'Quantity must be greater than 0' });
    }

    if (discount && (discount < 0 || discount > 100)) {
        return res.status(400).send({ message: 'Discount must be between 0 and 100' });
    }

    try {
        const createdProduct = await addProduct({
            title,
            label,
            artists,
            genres,
            releaseDate,
            price: parseFloat(price),
            images: {
                large: {url: images[0], height: 640, width: 640},
                medium: {url: images[1], height: 300, width: 300},
                small: {url: images[2], height: 64, width: 64}
            },
            spotifyAlbumId,
            quantity,
            discount
        })
    
        if (!createdProduct) {
            return res.status(500).send({ message: 'Failed to create product' });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: 'Failed to create product' });
    }

    return res.status(201).send({ message: 'Product created successfully' });
}

export const addQuantity = async (req: express.Request, res: express.Response) => {
    const token = res.locals.token;
    const { id, quantity }: IAddQuantity = req.body;

    if (!token) {
        return res.status(401).send({ message: 'Unauthorized' });
    }

    if (!id || !quantity) {
        return res.status(400).send({ message: 'Missing required fields' });
    }

    if (quantity < 0) {
        return res.status(400).send({ message: 'Quantity must be greater than 0' });
    }

    try {
        const updatedProduct = await updateStock(id, quantity);
        if (!updatedProduct) {
            return res.status(404).send({ message: 'Product not found' });
        }

        return res.status(200).send({ message: 'Quantity added successfully' });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Failed to add quantity' });
    }
}

export const updateProductData = async (req: express.Request, res: express.Response) => {
    const token = res.locals.token;
    const {
        id,
        title,
        label,
        artists,
        genres,
        releaseDate,
        price,
        images,
        spotifyAlbumId,
        quantity,
        discount
    } = req.body;

    if (!id) {
        return res.send('No id provided').status(401)
    }

    if (artists && artists.length === 0) {
        return res.status(400).send({ message: 'Artists array cannot be empty' });
    }

    if (genres && genres.length === 0) {
        return res.status(400).send({ message: 'Genres array cannot be empty' });
    }

    if (images && images.length !== 3) {
        return res.status(400).send({ message: 'Images array must have 3 elements' });
    }

    if (quantity && quantity < 0) {
        return res.status(400).send({ message: 'Quantity must be greater than 0' });
    }

    if (discount && (discount < 0 || discount > 100)) {
        return res.status(400).send({ message: 'Discount must be between 0 and 100' });
    }

    if (price && Number(price) < 0) {
        return res.status(400).send({ message: 'Price must be greater then 0' });
    }

    try {
        const updatedProduct = await updateProduct(id, {
            title,
            label,
            artists,
            genres,
            releaseDate,
            price,
            images,
            spotifyAlbumId,
            quantity,
            discount
        })

        if (!updatedProduct) {
            return res.send('Failed to update product').status(500)
        }
        return res.send('Product updated').status(200)
    } catch (err) {
        console.error({err});
        return res.send('Failed to update product').status(500)
    }
}

export const addDiscounts = async (req: express.Request, res: express.Response) => {
    const token = res.locals.token;

    if (!token) {
        return res.status(401).send({ message: 'Unauthorized' });
    }

    const { discounts }: IDiscount = req.body;
    console.log(discounts);

    if (!discounts) {
        return res.status(400).send({ message: 'Missing required fields' }).end()
    }

    if (discounts.length === 0) {
        return res.status(400).send({ message: 'Discounts array cannot be empty' });
    }

    for (const discount of discounts) {
        if (discount.percentage < 0 || discount.percentage > 100) {
            return res.status(400).send({ message: 'Discount must be between 0 and 100' });
        }

        if (discount.id == undefined || discount.percentage == undefined) {
            return res.status(400).send({ message: 'Missing required fields' });
        }

        try {
            const updatedDiscount = updateDiscount(discount.id, discount.percentage);
            if (!updatedDiscount) {
                return res.status(404).send({ message: `Product ${discount.id} not found` });
            }
        }
        catch (err) {
            console.error(err);
            return res.status(500).send({ message: `Failed to update ${discount.id}` });
        }
    }

    return res.status(200).send({ message: 'Discounts added successfully' });
}

interface IProduct {
    title: string,
    label: string,
    artists: string[],
    genres: string[],
    releaseDate: Date,
    price: string,
    images: string[],
    spotifyAlbumId: string,
    quantity: number,
    discount: number
}

interface IDiscount {
    discounts: {
        id: string,
        percentage: number
    }[]
}

interface IAddQuantity {
    id: string,
    quantity: number
}

// !        ==============================
// !               CLIENT - No Auth
// !        ==============================

export const getFullProductsInfo = async (req: express.Request, res: express.Response) => {
    const _MAX_LIMIT = 20;
    
    const { ids } = req.body;

    if (!ids) {
        return res.status(400).send({ message: 'Missing required fields' });
    }

    if (ids.length > _MAX_LIMIT) {
        return res.status(400).send({ message: `You can only request ${_MAX_LIMIT} products at a time` });
    }

    try {
        const products = await getProductsByIds(ids);
        return res.status(200).send(products);
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: 'Failed to get products' });
    }
    
}

export const getProductsPage = async (req: express.Request, res: express.Response) => {
    const { page = 1, limit = 10 } = req.query
    const { title, genres, minPrice, maxPrice, discount }: IGetProductsPageBody = req.body;

    const _MAX_LIMIT = 20;
    const _MAX_PAGE = 100;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    
    const filters: any = {};

    filters.quantity = { $gt: 0 };
    
    if (pageNum > _MAX_PAGE) {
        return res.status(400).send({ message: `You can only request up to ${_MAX_PAGE} pages` });
    }

    if (limitNum > _MAX_LIMIT) {
        return res.status(400).send({ message: `You can only request up to ${_MAX_LIMIT} products per page` });
    }

    if (title) {
        filters.title = { $regex: title, $options: 'i' };
    }

    if (genres) {
        filters.genres = { $in: genres };
    }

    if (minPrice) {
        filters.price = { ...filters.price, $gte: minPrice };

    }
    
    if (maxPrice) {
        filters.price = { ...filters.price, $lte: maxPrice};
    }

    if (discount) {
        filters.discount = { ...filters.discount, $gt: 0 };
    }

    try {
        const products = await Product.find(filters)
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum)
            .select('title price _id images.small discount')


        const totalProducts = await Product.countDocuments(filters);

        return res.status(200).send({
            products,                                               // array of products - title, price, _id, images.small, discount
            currentPage: pageNum,                                   // current page - This is the page number that was requested
            totalPages: Math.ceil(totalProducts / limitNum),        // total pages - This is the total number of pages available
            totalProducts                                           // total products - This is the total number of products that match the filters
        })
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Failed to get products' });
    }
}

interface IGetProductsPageBody {
    title: string,
    genres: Array<string>,
    minPrice: number,
    maxPrice: number,
    discount: boolean
}