import mongoose, { Schema, model, models, type InferSchemaType } from 'mongoose';

const ProductSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    importPrice: { type: Number, required: true, min: 0 },
    facebookPrice: { type: Number, required: true, min: 0 },
    tiktokPrice: { type: Number, required: true, min: 0 },
    shopeePrice: { type: Number, required: true, min: 0 },
  },
  { timestamps: true },
);

export type ProductDoc = InferSchemaType<typeof ProductSchema> & { _id: mongoose.Types.ObjectId };

export const Product = models.Product || model('Product', ProductSchema);
