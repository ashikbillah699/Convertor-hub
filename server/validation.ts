import { z } from "zod";

const text = (max: number) => z.string().trim().min(1).max(max);
const list = (maxItems = 50) => z.array(text(500)).max(maxItems);
const toolCategories = list(8).refine(
  (values) => values.every((value) => ["PDF", "Image", "Video", "Audio", "Text", "General", "Calculator"].includes(value)),
  "Contains an unsupported tool category.",
);
const webImage = z.string().trim().min(1).max(2048).refine((value) => {
  if (value === "#") return true;
  try {
    return ["http:", "https:"].includes(new URL(value).protocol);
  } catch {
    return false;
  }
}, "Image must be an HTTP(S) URL.");

export const blogInput = z.object({
  id: text(100),
  title: text(250),
  excerpt: text(2000),
  category: text(100),
  author: text(150),
  date: text(80),
  readTime: text(50),
  image: webImage,
  content: list(100),
  tags: list(30),
  relatedToolCategories: toolCategories.default([]),
  isPublished: z.boolean().default(false),
}).strict();

export const productInput = z.object({
  id: text(100),
  name: text(200),
  slug: text(200).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must contain lowercase letters, numbers, and hyphens."),
  description: text(2000),
  longDescription: text(10000),
  category: text(100),
  price: text(80),
  rating: z.number().min(0).max(5),
  image: webImage,
  badge: z.union([text(80), z.null()]),
  features: list(50),
  pros: list(50),
  cons: list(50),
  affiliateUrl: z.string().trim().min(1).max(2048).refine((value) => {
    if (value === "#") return true;
    try {
      return ["http:", "https:"].includes(new URL(value).protocol);
    } catch {
      return false;
    }
  }, "Affiliate URL must be an HTTP(S) URL."),
  countries: list(100),
  relatedToolCategories: toolCategories.default([]),
  isPublished: z.boolean().default(false),
}).strict();

export const loginInput = z.object({
  username: text(150),
  password: z.string().min(1).max(200),
}).strict();
