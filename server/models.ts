import mongoose, { Schema } from "mongoose";
import type { BlogPost } from "../src/data/blogPosts";
import type { Product as ProductData } from "../src/data/products";

export interface BlogRecord extends BlogPost {
  relatedToolCategories: string[];
  isPublished: boolean;
}

export interface ProductRecord extends ProductData {
  isPublished: boolean;
}

const stringArray = {
  type: [String],
  default: [],
};

const blogSchema = new Schema<BlogRecord>({
  id: { type: String, required: true, unique: true, trim: true },
  title: { type: String, required: true, trim: true },
  excerpt: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  author: { type: String, required: true, trim: true },
  date: { type: String, required: true, trim: true },
  readTime: { type: String, required: true, trim: true },
  image: { type: String, required: true, trim: true },
  content: stringArray,
  tags: stringArray,
  relatedToolCategories: stringArray,
  isPublished: { type: Boolean, default: false, required: true },
}, { timestamps: true, versionKey: false });

const productSchema = new Schema<ProductRecord>({
  id: { type: String, required: true, unique: true, trim: true },
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
  description: { type: String, required: true, trim: true },
  longDescription: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  price: { type: String, required: true, trim: true },
  rating: { type: Number, required: true, min: 0, max: 5 },
  image: { type: String, required: true, trim: true },
  badge: { type: String, default: null },
  features: stringArray,
  pros: stringArray,
  cons: stringArray,
  affiliateUrl: { type: String, required: true, trim: true },
  countries: stringArray,
  relatedToolCategories: stringArray,
  isPublished: { type: Boolean, default: false, required: true },
}, { timestamps: true, versionKey: false });

export const Blog = mongoose.models.Blog || mongoose.model<BlogRecord>("Blog", blogSchema);
export const Product = mongoose.models.Product || mongoose.model<ProductRecord>("Product", productSchema);
