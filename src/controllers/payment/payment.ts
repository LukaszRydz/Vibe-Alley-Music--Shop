import { getTranslate } from '../../translations';
import { getProductsByIds } from '../../database/schemas/product';
import { Transaction } from '../../database/schemas/transaction';
import { Stripe as stripeVar } from '../../helpers/variables';
import { Host } from '../../helpers/variables';
import express from 'express';
import Stripe from 'stripe';

const stripe = new Stripe(stripeVar.STRIPE_ID);

const dpdCost = 14.99;
const inpostCost = 9.99;

const round = (price: number) => Math.round(price * 100);

export const createPaymentIntent = async (req: express.Request, res: express.Response) => {
    const productsToBuy = req.body.productsToBuy;
    const deliveryData = req.body.deliveryData;
    const client = res.locals.token;
    const lang = (req.headers['Accept-Language']?.[0] || 'en');

    if (!productsToBuy || productsToBuy.length === 0) {
        return res.status(400).json({ error: getTranslate('error', 'missingFields', lang) });
    }

    if (!deliveryData || !deliveryData.name || !deliveryData.city || !deliveryData.street || !deliveryData.postalCode || !deliveryData.phone || !deliveryData.email) {
        return res.status(400).json({ error: getTranslate('error', 'missingFields', lang) });
    }

    if (!deliveryData.payment || (deliveryData.payment !== 'card' && deliveryData.payment !== 'blik')) {
        return res.status(400).json({ error: getTranslate('error', 'paymentType', lang) });
    }

    if (!client || !client.id) {
        return res.status(400).json({ error: getTranslate('error', 'notLoggedIn', lang) });
    }

    try {
        const products = await getProductsByIds(productsToBuy.map((product: any) => product._id));

        if (!products || products.length !== productsToBuy.length) {
            return res.status(404).json({ error: getTranslate('error', 'productsNotFound', lang) });
        }

        const lineItems = products.map((product) => {
            const price = product.discount
                ? (product.price - (product.discount / 100) * product.price)
                : product.price;

            return {
                price_data: {
                    currency: 'pln',
                    product_data: { name: product.title, images: [product.images.small.url] },
                    unit_amount: round(price),
                },
                quantity: productsToBuy.find((productToBuy: any) => productToBuy._id.toString() === product._id.toString()).quantity,
            };
        });

        const deliveryCost = deliveryData.deliveryMethod === 'inpost' ? inpostCost : dpdCost;
        const session = await stripe.checkout.sessions.create({
            payment_method_types: deliveryData.payment === 'blik' ? ['blik'] : ['card'],
            line_items: lineItems,
            shipping_options: [{
                shipping_rate_data: {
                    display_name: deliveryData.deliveryMethod === 'inpost' ? 'InPost' : 'DPD',
                    fixed_amount: { amount: round(deliveryCost), currency: 'pln' },
                    type: 'fixed_amount',
                }
            }],
            mode: 'payment',
            success_url: `${Host.FRONT}/success`,
            cancel_url: `${Host.FRONT}/cancel`
        });

        // Obliczanie całkowitej kwoty
        const totalAmount = lineItems.reduce((total, item) => total + item.price_data.unit_amount * item.quantity, round(deliveryCost));

        // Tworzenie dokumentu transakcji
        const transaction = new Transaction({
            products: products.map((product, index) => ({
                productId: product._id,
                quantity: productsToBuy[index].quantity,
                price: product.price,
                discount: product.discount || 0
            })),
            userId: client.id,
            deliveryMethod: deliveryData.deliveryMethod,
            deliveryCost: deliveryCost,
            paymentMethod: deliveryData.payment,
            totalAmount,
            sessionId: session.id,
            status: 'payment_pending',
            deliveryData: {
                name: deliveryData.name,
                city: deliveryData.city,
                street: deliveryData.street,
                postalCode: deliveryData.postalCode,
                phone: deliveryData.phone,
                email: deliveryData.email
            }
        });

        await transaction.save();

        res.json({ id: session.id });
    } catch (error) {
        console.error('Błąd podczas tworzenia sesji Checkout:', error);
        res.status(500).json({ error: getTranslate('error', 'stripeSession', lang) });
    }
};