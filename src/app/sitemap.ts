import type { MetadataRoute } from "next";

import { getCategories, getProducts } from "@/lib/api/catalog";
import { SITE } from "@/lib/site";

async function fetchAllProducts() {
  const firstPage = await getProducts({ page: 1, limit: 100 });
  const items = [...firstPage.data];
  const pages = Math.min(firstPage.totalPages, 5);

  for (let page = 2; page <= pages; page += 1) {
    const next = await getProducts({ page, limit: 100 });
    items.push(...next.data);
  }

  return items;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([
    fetchAllProducts(),
    getCategories(100),
  ]);

  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE.url, lastModified: now, changeFrequency: "daily", priority: 1 },
    {
      url: `${SITE.url}/products`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE.url}/categories`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${SITE.url}/products/${product.slug}`,
    lastModified: new Date(product.updatedAt),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${SITE.url}/products?category=${category.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
