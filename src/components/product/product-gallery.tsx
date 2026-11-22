"use client";

import { useState } from "react";

import { ProductImage } from "@/components/product/product-image";
import { cn } from "@/lib/cn";

interface GalleryImage {
  id: string;
  imageUrl: string;
}

export function ProductGallery({
  name,
  images,
}: {
  name: string;
  images: GalleryImage[];
}) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];

  return (
    <div className="space-y-3">
      <div className="relative aspect-square overflow-hidden rounded-3xl border border-stone-200/80 bg-stone-50">
        <ProductImage
          src={current?.imageUrl}
          alt={name}
          sizes="(max-width: 1024px) 100vw, 55vw"
          priority
          className="transition duration-500"
        />
      </div>

      {images.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`تصویر ${index + 1}`}
              className={cn(
                "relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-stone-50 transition",
                index === active
                  ? "border-brand-600"
                  : "border-transparent hover:border-stone-300",
              )}
            >
              <ProductImage
                src={image.imageUrl}
                alt={`${name} - تصویر ${index + 1}`}
                sizes="80px"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
