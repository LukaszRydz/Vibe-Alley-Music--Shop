import { getTranslate } from '../../translations';
import { MessageModel } from '../../database/schemas/message';
import express from 'express'

export const sendMessage = async (req: express.Request, res: express.Response) => {
    const { name, email, message } = req.body;
    const lang = (req.headers['Accept-Language']?.[0] || 'en');

    if (!name || !email || !message) {
        return res.status(400).send({ error: getTranslate('error', 'missingFields', lang) });
    }

    if (name.length < 2 || name.length > 15) {
        return res.status(400).send({ error: getTranslate('error', 'nameLength', lang, {min: 2, max: 15}) });
    }

    if (email.length < 5 || email.length > 30) {
        return res.status(400).send({ error: getTranslate('error', 'emailLength', lang, {min: 5, max: 30}) });
    }

    if (message.length < 10 || message.length > 500) {
        return res.status(400).send({ error: getTranslate('error', 'messageLength', lang, {min: 10, max: 500}) });
    }

    try {
        const messageObj = MessageModel.create({ name, email, message });

        if (!messageObj) {
            return res.status(500).send({ error: getTranslate('error', 'failedToSend', lang) });
        }

        return res.status(200).send({ message: getTranslate('success', 'messageSent', lang), showSuccess: true });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ error: getTranslate('error', 'failedToSend', lang) });
    }
}