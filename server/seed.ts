import { blogPosts } from "../src/data/blogPosts";
import { products } from "../src/data/products";
import { config, validateConfig } from "./config";
import { connectDatabase } from "./db";
import { Blog, Product } from "./models";

const blogToolCategories: Record<string, string[]> = {
  "PDF Tips": ["PDF"],
  "Image Tips": ["Image"],
  "Video Tips": ["Video"],
  "Audio Tips": ["Audio"],
  "Tools Guide": ["Text", "General", "Calculator"],
};

const seed = async () => {
  validateConfig();
  await connectDatabase();

  let insertedBlogs = 0;
  for (const post of blogPosts) {
    const result = await Blog.updateOne(
      { id: post.id },
      { $setOnInsert: {
        ...post,
        relatedToolCategories: blogToolCategories[post.category] || [],
        isPublished: true,
      } },
      { upsert: true },
    );
    insertedBlogs += result.upsertedCount > 0 ? 1 : 0;
  }
  let insertedProducts = 0;
  for (const product of products) {
    const result = await Product.updateOne(
      { id: product.id },
      { $setOnInsert: { ...product, isPublished: true } },
      { upsert: true },
    );
    insertedProducts += result.upsertedCount > 0 ? 1 : 0;
  }
  const [blogCount, productCount] = await Promise.all([Blog.countDocuments(), Product.countDocuments()]);
  console.log(`Seed complete. Added ${insertedBlogs} blogs and ${insertedProducts} products.`);
  console.log(`Database now contains ${blogCount} blogs and ${productCount} products.`);
};

seed()
  .catch((error: unknown) => {
    console.error("Content seed failed:", error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (config.mongoUri) {
      const mongoose = await import("mongoose");
      await mongoose.default.disconnect();
    }
  });
