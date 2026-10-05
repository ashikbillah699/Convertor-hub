import { describe, expect, it } from "vitest";
import { blogPosts } from "../src/data/blogPosts";
import { products } from "../src/data/products";
import { blogInput, productInput } from "./validation";

describe("content migration and validation", () => {
  it("retains the existing six blog and twelve product seed records", () => {
    expect(blogPosts).toHaveLength(6);
    expect(products).toHaveLength(12);
  });

  it("accepts canonical blog and product records with publish metadata", () => {
    expect(blogInput.safeParse({
      ...blogPosts[0],
      relatedToolCategories: ["PDF"],
      isPublished: true,
    }).success).toBe(true);
    expect(productInput.safeParse({
      ...products[0],
      isPublished: true,
    }).success).toBe(true);
  });

  it("rejects unsafe affiliate URLs and unsupported tool categories", () => {
    expect(productInput.safeParse({
      ...products[0],
      affiliateUrl: "javascript:alert(1)",
      isPublished: true,
    }).success).toBe(false);
    expect(blogInput.safeParse({
      ...blogPosts[0],
      relatedToolCategories: ["Unknown"],
      isPublished: true,
    }).success).toBe(false);
  });
});
