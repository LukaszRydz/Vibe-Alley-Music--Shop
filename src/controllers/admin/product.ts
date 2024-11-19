import { addProduct, updateProduct, updateStock, updateDiscount } from '../../database/schemas/product';
import express from 'express'

export const createProduct = async (req: express.Request, res: express.Response) => {
    const {
        title, label, artists, tracks, genres, releaseDate, price, images, spotifyAlbumId, quantity, discount
    }: IProduct = req.body;

    const missingFields = [title, label, artists, tracks, genres, releaseDate, price, images, String(quantity)].some(field => !field);
    if (missingFields) return res.status(400).send({ message: 'Missing required fields' });

    const validators = [
        { condition: !artists.length, message: 'Artists array cannot be empty' },
        { condition: !tracks.length, message: 'Tracks array cannot be empty' },
        { condition: !genres.length, message: 'Genres array cannot be empty' },
        { condition: images.length !== 3, message: 'Images array must have 3 elements' },
        { condition: quantity < 0, message: 'Quantity must be greater than 0' },
        { condition: discount && (discount < 0 || discount > 100), message: 'Discount must be between 0 and 100' }
    ];

    for (const { condition, message } of validators) {
        if (condition) return res.status(400).send({ message });
    }

    try {
        const createdProduct = await addProduct({
            title, label, artists, genres, tracks, releaseDate,
            price: parseFloat(price),
            images: {
                large: { url: images[0], height: 640, width: 640 },
                medium: { url: images[1], height: 300, width: 300 },
                small: { url: images[2], height: 64, width: 64 }
            },
            spotifyAlbumId, quantity, discount
        });
        if (!createdProduct) return res.status(500).send({ message: 'Failed to create product' });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: 'Failed to create product' });
    }

    return res.status(201).send({ message: 'Product created successfully' });
}

export const addQuantity = async (req: express.Request, res: express.Response) => {
    const { id, quantity }: IAddQuantity = req.body;
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
    const { spotifyAlbumId, artists, tracks, genres, images, quantity, discount, price } = req.body;
    const validations = [
        { condition: !spotifyAlbumId, message: 'No id provided', status: 401 },
        { condition: artists?.length === 0, message: 'Artists array cannot be empty', status: 400 },
        { condition: tracks?.length === 0, message: 'Tracks array cannot be empty', status: 400 },
        { condition: genres?.length === 0, message: 'Genres array cannot be empty', status: 400 },
        { condition: images?.length !== 3, message: 'Images array must have 3 elements', status: 400 },
        { condition: quantity < 0, message: 'Quantity must be greater than 0', status: 400 },
        { condition: discount < 0 || discount > 100, message: 'Discount must be between 0 and 100', status: 400 },
        { condition: price < 0, message: 'Price must be greater than 0', status: 400 }
    ];

    for (const { condition, message, status } of validations) {
        if (condition) return res.status(status).send({ message });
    }

    try {
        const updatedProduct = await updateProduct(spotifyAlbumId, req.body);
        if (!updatedProduct) return res.status(500).send('Failed to update product');
        return res.status(200).send('Product updated');
    } catch (err) {
        console.error(err);
        return res.status(500).send('Failed to update product');
    }
};

export const addDiscounts = async (req: express.Request, res: express.Response) => {
    const { discounts }: IDiscount = req.body;
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
    tracks: string[],
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