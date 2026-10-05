import { Router } from "express";
import type { Request, RequestHandler, Response } from "express";
import { rateLimit } from "express-rate-limit";
import { z } from "zod";
import { createAdminSession, clearAdminSession, requireAdmin, verifyAdminPassword } from "./auth";
import { databaseReady } from "./db";
import { Blog, Product } from "./models";
import { blogInput, loginInput, productInput } from "./validation";

const asyncRoute = (handler: (request: Request, response: Response) => Promise<void>): RequestHandler =>
  (request, response, next) => {
    void handler(request, response).catch(next);
  };

const databaseRequired: RequestHandler = (_request, response, next) => {
  if (!databaseReady()) {
    response.status(503).json({ error: "Content database is unavailable. Check the local MongoDB connection." });
    return;
  }
  next();
};

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many sign-in attempts. Try again in 15 minutes." },
});

const toolCategoryQuery = z.string().max(40).optional();
export const apiRouter = Router();

apiRouter.get("/health", (_request, response) => {
  response.json({ status: "ok", database: databaseReady() ? "connected" : "disconnected" });
});

apiRouter.get("/blogs", databaseRequired, asyncRoute(async (request, response) => {
  const toolCategory = toolCategoryQuery.parse(request.query.toolCategory);
  const filter: Record<string, unknown> = { isPublished: true };
  if (toolCategory) filter.relatedToolCategories = toolCategory;
  const blogs = await Blog.find(filter).select("-_id -__v").sort({ createdAt: 1 }).lean();
  response.json(blogs);
}));

apiRouter.get("/blogs/:id", databaseRequired, asyncRoute(async (request, response) => {
  const blog = await Blog.findOne({ id: request.params.id, isPublished: true }).select("-_id -__v").lean();
  if (!blog) {
    response.status(404).json({ error: "Blog post not found." });
    return;
  }
  response.json(blog);
}));

apiRouter.get("/products", databaseRequired, asyncRoute(async (_request, response) => {
  const products = await Product.find({ isPublished: true }).select("-_id -__v").sort({ createdAt: 1 }).lean();
  response.json(products);
}));

apiRouter.get("/products/:slug", databaseRequired, asyncRoute(async (request, response) => {
  const product = await Product.findOne({ slug: request.params.slug, isPublished: true }).select("-_id -__v").lean();
  if (!product) {
    response.status(404).json({ error: "Product not found." });
    return;
  }
  response.json(product);
}));

export const adminRouter = Router();
adminRouter.post("/auth/login", loginLimiter, asyncRoute(async (request, response) => {
  const { username, password } = loginInput.parse(request.body);
  const valid = await verifyAdminPassword(username, password);
  if (!valid) {
    response.status(401).json({ error: "Invalid username or password." });
    return;
  }
  createAdminSession(response);
  response.json({ username });
}));

adminRouter.post("/auth/logout", (_request, response) => {
  clearAdminSession(response);
  response.status(204).end();
});

adminRouter.get("/auth/session", requireAdmin, (_request, response) => {
  response.json({ authenticated: true });
});

adminRouter.use(requireAdmin);
adminRouter.use(databaseRequired);

adminRouter.get("/dashboard", asyncRoute(async (_request, response) => {
  const [blogs, publishedBlogs, products, publishedProducts] = await Promise.all([
    Blog.countDocuments(),
    Blog.countDocuments({ isPublished: true }),
    Product.countDocuments(),
    Product.countDocuments({ isPublished: true }),
  ]);
  response.json({ blogs, publishedBlogs, products, publishedProducts });
}));

adminRouter.get("/blogs", asyncRoute(async (_request, response) => {
  response.json(await Blog.find().select("-_id -__v").sort({ createdAt: 1 }).lean());
}));

adminRouter.post("/blogs", asyncRoute(async (request, response) => {
  const input = blogInput.parse(request.body);
  const blog = await Blog.create(input);
  const { _id: _blogMongoId, ...savedBlog } = blog.toObject({ versionKey: false });
  response.status(201).json(savedBlog);
}));

adminRouter.put("/blogs/:id", asyncRoute(async (request, response) => {
  const input = blogInput.parse(request.body);
  if (input.id !== request.params.id) {
    response.status(400).json({ error: "The blog ID cannot be changed." });
    return;
  }
  const blog = await Blog.findOneAndUpdate({ id: request.params.id }, input, { new: true, runValidators: true })
    .select("-_id -__v").lean();
  if (!blog) {
    response.status(404).json({ error: "Blog post not found." });
    return;
  }
  response.json(blog);
}));

adminRouter.delete("/blogs/:id", asyncRoute(async (request, response) => {
  const result = await Blog.deleteOne({ id: request.params.id });
  if (!result.deletedCount) {
    response.status(404).json({ error: "Blog post not found." });
    return;
  }
  response.status(204).end();
}));

adminRouter.get("/products", asyncRoute(async (_request, response) => {
  response.json(await Product.find().select("-_id -__v").sort({ createdAt: 1 }).lean());
}));

adminRouter.post("/products", asyncRoute(async (request, response) => {
  const input = productInput.parse(request.body);
  const product = await Product.create(input);
  const { _id: _productMongoId, ...savedProduct } = product.toObject({ versionKey: false });
  response.status(201).json(savedProduct);
}));

adminRouter.put("/products/:id", asyncRoute(async (request, response) => {
  const input = productInput.parse(request.body);
  if (input.id !== request.params.id) {
    response.status(400).json({ error: "The product ID cannot be changed." });
    return;
  }
  const product = await Product.findOneAndUpdate({ id: request.params.id }, input, { new: true, runValidators: true })
    .select("-_id -__v").lean();
  if (!product) {
    response.status(404).json({ error: "Product not found." });
    return;
  }
  response.json(product);
}));

adminRouter.delete("/products/:id", asyncRoute(async (request, response) => {
  const result = await Product.deleteOne({ id: request.params.id });
  if (!result.deletedCount) {
    response.status(404).json({ error: "Product not found." });
    return;
  }
  response.status(204).end();
}));

export const isValidationError = (error: unknown) =>
  error instanceof z.ZodError || (error instanceof Error && error.name === "ValidationError");

export const isDuplicateKeyError = (error: unknown) =>
  Boolean(error && typeof error === "object" && "code" in error && error.code === 11000);

export const isBadRequestError = (error: unknown) =>
  Boolean(error && typeof error === "object" && "status" in error && error.status === 400);
