import mongoose from 'mongoose';

export const Message = new mongoose.Schema({
    email: { type: String, required: true },
    name: { type: String, required: true },
    message: { type: String, required: true },
    // with timestamps
}, { timestamps: true });

export const MessageModel = mongoose.model('Message', Message);

export const addMessage = async (values: Record<string, any>) => await MessageModel.create(values);