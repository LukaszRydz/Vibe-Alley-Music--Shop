import { Product } from '../../database/schemas/product';
import express from 'express'


export const getAlbumByName = async (req: express.Request, res: express.Response) => {
    const name = req.query.name;

    if (!name) {
        return res.status(400).send({ message: 'Name is required' });
    }

    try {
        const album = await Product.findOne({
            title: { $regex: name, $options: 'i' }
        }).select('_id, title')

        if (!album) {
            return res.status(404).send({ message: 'Album not found' });
        }

        return res.status(200).send({album: album});
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: 'Failed to get album' });
    }
}

export const getAlbumsByArtist = async (req: express.Request, res: express.Response) => {
    const artist = req.query.artist;
    
    if (!artist) {
        return res.status(400).send({ message: 'Artist is required' });
    }

    try {
        const albums = await Product.find({
            artists: { $elemMatch: { $regex: artist, $options: 'i' } }
        }).select('_id, title')

        if (!albums) {
            return res.status(404).send({ message: 'Albums not found' });
        }

        return res.status(200).send({albums: albums});
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: 'Failed to get albums' });
    }
}

export const getNewestAlbums = async (req: express.Request, res: express.Response) => {
    const limit = 10;

    try {
        const albums = await Product.find().sort({ releaseDate: -1 }).limit(limit).select('_id, title');

        if (!albums) {
            return res.status(404).send({ message: 'Albums not found' });
        }

        return res.status(200).send({albums: albums});
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: 'Failed to get albums' });
    }
}