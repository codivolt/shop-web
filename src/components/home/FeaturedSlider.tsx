"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

import { ProductImage } from "@/components/product/product-image";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";
import { http } from "@/lib/api/client";
import { cn } from "@/lib/cn";

interface FeaturedSliderProps {
  className?: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export function FeaturedSlider({
  className,
  autoPlay = true,
  autoPlayInterval = 5000,
}: FeaturedSliderProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const fetchFeaturedProducts = useCallback(async () => {
    try {
      const { data } = await http.get<Product[]>("/products/featured/list");
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch featured products:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  useEffect(() => {
    if (!autoPlay || products.length <= 1 || isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, products.length, autoPlayInterval, isHovered]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
  };

  if (loading) {
    return (
      <div className={cn("relative overflow-hidden rounded-3xl bg-stone-100", className)}>
        <div className="aspect-[16/9] animate-pulse bg-stone-200" />
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-2 w-2 rounded-full bg-stone-300" />
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  const currentProduct = products[currentIndex];

  return (
    <div
      className={cn("relative overflow-hidden rounded-3xl bg-white", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
<Link
        href={`/products/${currentProduct.slug}`}
        className="block relative aspect-[16/9] overflow-hidden"
      >
        <div className="relative h-full w-full">
          <ProductImage
            src={currentProduct.imageUrl}
            alt={currentProduct.name}
            sizes="100vw"
            priority
            className="object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900/80 via-stone-900/40 to-transparent" />
        <div className="absolute inset-0 flex items-center px-8">
          <div className="max-w-xl text-white">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-sm">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inset-0 rounded-full bg-amber-400 animate-ping opacity-75" />
                <span className="relative rounded-full bg-amber-400" />
              </span>
              پیشنهادی ویژه
            </span>
            <h3 className="mt-4 text-3xl md:text-4xl font-black leading-tight">
              {currentProduct.name}
            </h3>
            {currentProduct.description && (
              <p className="mt-3 line-clamp-2 text-lg text-stone-200">
                {currentProduct.description}
              </p>
            )}
            <div className="mt-6 flex items-center gap-4">
              <span className="text-2xl md:text-3xl font-black">
                {formatPrice(currentProduct.price)}
              </span>
              <span className="px-4 py-2 rounded-xl bg-white text-stone-900 font-semibold hover:bg-stone-100 transition-colors">
                مشاهده محصول
              </span>
            </div>
          </div>
        </div>
      </Link>

      {products.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/80 text-stone-900 backdrop-blur-sm hover:bg-white transition-all disabled:opacity-50"
            aria-label="اسلاید قبلی"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/80 text-stone-900 backdrop-blur-sm hover:bg-white transition-all disabled:opacity-50"
            aria-label="اسلاید بعدی"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {products.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  "h-2 w-2 rounded-full transition-all",
                  index === currentIndex
                    ? "w-8 bg-white"
                    : "bg-white/50 hover:bg-white"
                )}
                aria-label={`برو به اسلاید ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}