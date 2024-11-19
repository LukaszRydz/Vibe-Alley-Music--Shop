// transactionSchema.js
import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    products: [{
        productId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        discount: { type: Number, default: 0 }
    }],
    deliveryMethod: { type: String, required: true },
    deliveryCost: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    sessionId: { type: String, required: true }, // Stripe session ID
    status: { type: String, default: 'pending' },
    createdAt: { type: Date, default: Date.now },
    deliveryData: {
        name: String,
        city: String,
        street: String,
        postalCode: String,
        phone: String,
        email: String
    }
});

export const Transaction = mongoose.model('Transaction', transactionSchema);
