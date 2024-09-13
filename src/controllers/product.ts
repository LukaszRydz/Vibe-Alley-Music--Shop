import { addProduct } from '../database/schemas/product';
import express from 'express'

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
    } = req.body;

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

interface createProduct {
    title: string,
    label: string,
    artists: string[],
    genres: string[],
    releaseDate: Date,
    price: number,
    images: string[],
    spotifyAlbumId: string,
    quantity: number,
    discount: number
}