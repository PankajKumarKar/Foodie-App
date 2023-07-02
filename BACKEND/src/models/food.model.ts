import { Schema, model } from "mongoose";

export interface Food {
  id: string;
  name: string;
  price: number;
  tags: string[];
  favorite: boolean;
  stars: number;
  imageUrl: string;
  origins: string[];
  cookTime: string;
}

export const foodSchema = new Schema<Food>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    tags: { type: [String], required: true },
    favorite: { type: Boolean, required: true },
    stars: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    origins: { type: [String], required: true },
    cookTime: { type: String, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

export const foodModel = model<Food>("food", foodSchema);
