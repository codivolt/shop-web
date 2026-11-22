import "server-only";

import type {
  Brand,
  Category,
  Paginated,
  Product,
  ProductAttributeValue,
  ProductImage,
} from "../types";
import { buildQuery, serverFetch } from "./server";

export interface ProductListParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  brandId?: string;
  minPrice?: number;
  maxPrice?: number;
}

const EMPTY_PAGE: Paginated<never> = {
  data: [],
  total: 0,
  page: 1,
  limit: 0,
  totalPages: 0,
};

export async function getProducts(
  params: ProductListParams = {},
): Promise<Paginated<Product>> {
  try {
    return await serverFetch<Paginated<Product>>(
      `/products${buildQuery({
        page: params.page ?? 1,
        limit: params.limit ?? 12,
        search: params.search,
        categoryId: params.categoryId,
        brandId: params.brandId,
        minPrice: params.minPrice,
        maxPrice: params.maxPrice,
        isActive: true,
      })}`,
    );
  } catch {
    return { ...EMPTY_PAGE, limit: params.limit ?? 12 };
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {

  try {
    return await serverFetch<Product>(`/products/slug/${encodeURIComponent(slug)}`);
  } catch {
    return null;
  }
}

export async function getProductImages(
  productId: string,
): Promise<ProductImage[]> {

  try {
    return await serverFetch<ProductImage[]>(`/products/${productId}/images`);
  } catch {
    return [];
  }
}

export async function getProductAttributeValues(
  productId: string,
): Promise<ProductAttributeValue[]> {

  try {
    return await serverFetch<ProductAttributeValue[]>(
      `/products/${productId}/attribute-values`,
    );
  } catch {
    return [];
  }
}

export async function getCategories(limit = 100): Promise<Category[]> {

  try {
    const response = await serverFetch<Paginated<Category>>(
      `/categories${buildQuery({ limit, isActive: true })}`,
    );
    return response.data;
  } catch {
    return [];
  }
}

export async function getCategoryBySlug(
  slug: string,
): Promise<Category | null> {

  try {
    return await serverFetch<Category>(
      `/categories/slug/${encodeURIComponent(slug)}`,
    );
  } catch {
    return null;
  }
}

export async function getBrands(limit = 100): Promise<Brand[]> {

  try {
    const response = await serverFetch<Paginated<Brand>>(
      `/brands${buildQuery({ limit, isActive: true })}`,
    );
    return response.data;
  } catch {
    return [];
  }
}

export async function getRelatedProducts(
  categoryId: string,
  excludeId: string,
  limit = 4,
): Promise<Product[]> {

  try {
    const response = await serverFetch<Paginated<Product>>(
      `/products${buildQuery({
        categoryId,
        limit: limit + 1,
        isActive: true,
      })}`,
    );
    return response.data.filter((item) => item.id !== excludeId).slice(0, limit);
  } catch {
    return [];
  }
}
