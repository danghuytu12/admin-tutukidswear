import mongoose, { Schema, model, models, type InferSchemaType } from 'mongoose';

const InventorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    size: { type: String, required: true, trim: true },
    color: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 0, default: 0 },
  },
  { timestamps: true },
);

export type InventoryDoc = InferSchemaType<typeof InventorySchema> & { _id: mongoose.Types.ObjectId };

export const Inventory = models.Inventory || model('Inventory', InventorySchema);
