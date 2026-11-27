import type { Metadata } from "next";

import { BrandsSection } from "@/components/home/brands-section";
import { CategoriesSection } from "@/components/home/categories-section";
import { FeaturesStrip } from "@/components/home/features-strip";
import { HeroSection } from "@/components/home/hero-section";
import { JoinSection } from "@/components/home/join-section";
import { NewArrivalsSection } from "@/components/home/new-arrivals-section";
import { WhySection } from "@/components/home/why-section";
import { SplashSlider } from "@/components/home/splash-slider";
import { getBrands, getCategories, getProducts } from "@/lib/api/catalog";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: SITE.tagline },
  description: SITE.description,
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [products, categories, brands] = await Promise.all([
    getProducts({ limit: 8 }),
    getCategories(8),
    getBrands(10),
  ]);

  const featured = products.data[0];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: SITE.name,
        url: SITE.url,
        inLanguage: "fa-IR",
        potentialAction: {
          "@type": "SearchAction",
          target: `${SITE.url}/products?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Store",
        name: SITE.name,
        url: SITE.url,
        description: SITE.description,
        telephone: SITE.phone,
        address: {
          "@type": "PostalAddress",
          addressCountry: "IR",
          streetAddress: SITE.address,
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <HeroSection
        productCount={products.total}
        categoryCount={categories.length}
        featured={featured}
        related={products.data.slice(1, 3)}
      />

      <FeaturesStrip />

      <SplashSlider />

      <CategoriesSection categories={categories} />

      <NewArrivalsSection products={products.data} />

      <WhySection />

      <BrandsSection brands={brands} />

      <JoinSection />
    </>
  );
}