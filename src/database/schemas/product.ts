import mongoose from "mongoose";

export const ProductSchema = new mongoose.Schema({
    title: { type: String, required: true },
    label: { type: String, required: true },
    artists: [{ type: String, required: true }],
    genres: [{ type: String, required: true }],
    releaseDate: { type: Date, required: true },
    price: { type: Number, required: true },
    images: {
        large: { url: { type: String, required: true }, height: { type: Number, required: true }, width: { type: Number, required: true } },
        medium: { url: { type: String, required: true }, height: { type: Number, required: true }, width: { type: Number, required: true } },
        small: { url: { type: String, required: true }, height: { type: Number, required: true }, width: { type: Number, required: true } }
    },
    spotifyAlbumId: { type: String, required: false, unique: true, sparse: true },
    quantity: { type: Number, required: true },
    discount: { type: Number, required: false },
});

export const Product = mongoose.model("Product", ProductSchema);

// Client actions
export const getProductById = async (id: string) => Product.findById(id);

// ? Get all products with pagination
export const getAllProducts = async (filter: Record<string, any>, limit: number, page: number) =>
    Product.find(filter)
        .limit(limit)
        .skip(limit * (page - 1));

export const checkProductsExist = async (ids: string[]) => {
    const existingProducts = await Product.find({ _id: { $in: ids } });
    return existingProducts.length === ids.length;
};

// Admin actions
export const addProduct = async (values: Record<string, any>) => await Product.create(values);
export const updateProduct = async (id: string, values: Record<string, any>) => Product.findByIdAndUpdate(id, values, { new: true });
export const deleteProduct = async (id: string) => Product.findByIdAndDelete(id);
export const updateStock = async (id: string, quantity: number) => Product.findByIdAndUpdate(id, { quantity });
export const updateDiscount = async (id: string, discount: number) => Product.findByIdAndUpdate(id, { discount });
