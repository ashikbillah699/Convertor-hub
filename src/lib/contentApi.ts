import type { BlogPost } from "@/data/blogPosts";
import type { Product } from "@/data/products";

export interface ManagedBlog extends BlogPost {
  relatedToolCategories: string[];
  isPublished: boolean;
}

export interface PublicBlog extends BlogPost {
  relatedToolCategories: string[];
}

export interface ManagedProduct extends Product {
  isPublished: boolean;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api${path}`, {
    ...init,
    headers: {
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
    credentials: "include",
  });

  if (!response.ok) {
    let message = `Request failed (${response.status}).`;
    try {
      const body = await response.json() as { error?: string };
      if (body.error) message = body.error;
    } catch {
      // Keep the HTTP status as the explicit fallback when the server did not return JSON.
    }
    throw new Error(message);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export const getPublicBlogs = () => request<PublicBlog[]>("/blogs");
export const getPublicBlog = (id: string) => request<PublicBlog>(`/blogs/${encodeURIComponent(id)}`);
export const getPublicProducts = () => request<Product[]>("/products");
export const getPublicProduct = (slug: string) => request<Product>(`/products/${encodeURIComponent(slug)}`);

export const adminApi = {
  session: () => request<{ authenticated: boolean }>("/admin/auth/session"),
  login: (username: string, password: string) =>
    request<{ username: string }>("/admin/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),
  logout: () => request<void>("/admin/auth/logout", { method: "POST" }),
  blogs: () => request<ManagedBlog[]>("/admin/blogs"),
  products: () => request<ManagedProduct[]>("/admin/products"),
  saveBlog: (blog: ManagedBlog, create: boolean) =>
    request<ManagedBlog>(create ? "/admin/blogs" : `/admin/blogs/${encodeURIComponent(blog.id)}`, {
      method: create ? "POST" : "PUT",
      body: JSON.stringify(blog),
    }),
  saveProduct: (product: ManagedProduct, create: boolean) =>
    request<ManagedProduct>(create ? "/admin/products" : `/admin/products/${encodeURIComponent(product.id)}`, {
      method: create ? "POST" : "PUT",
      body: JSON.stringify(product),
    }),
  deleteBlog: (id: string) => request<void>(`/admin/blogs/${encodeURIComponent(id)}`, { method: "DELETE" }),
  deleteProduct: (id: string) => request<void>(`/admin/products/${encodeURIComponent(id)}`, { method: "DELETE" }),
};
