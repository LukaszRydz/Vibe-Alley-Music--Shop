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
export const getProductsByIds = async (ids: string[]) => Product.find({ _id: { $in: ids } });



export const checkProductsExist = async (ids: string[]) => {
    const existingProducts = await Product.find({ _id: { $in: ids } });
    return existingProducts.length === ids.length;
};

// Admin actions
export const addProduct = async (values: Record<string, any>) => await Product.create(values);
export const updateProduct = async (id: string, values: Record<string, any>) => {
    const newValues = Object.fromEntries(Object.entries(values).filter(([_, value]) => value !== undefined))
    console.log(newValues);
    return await Product.findByIdAndUpdate(id, { $set: newValues }, { new: true })
}

export const deleteProduct = async (id: string) => Product.findByIdAndDelete(id);
// add quantity to current stock
export const updateStock = async (id: string, quantity: number) => Product.findByIdAndUpdate(id, { $inc: { quantity } }); 
export const updateDiscount = async (id: string, discount: number) => Product.findByIdAndUpdate(id, { $set: { discount } });