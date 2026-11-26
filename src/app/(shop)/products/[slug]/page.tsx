import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductCardComponent, ProductGrid, Breadcrumbs, PageLayout, SectionCard, Badge, StatCard } from "@/components/ui";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductPurchasePanel } from "@/components/product/product-purchase-panel";
import {
  getProductAttributeValues,
  getProductBySlug,
  getProductImages,
  getProducts,
  getRelatedProducts,
} from "@/lib/api/catalog";
import { absoluteImage, formatDate, formatNumber, formatPrice } from "@/lib/format";
import { SITE } from "@/lib/site";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

function decodeSlug(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export async function generateStaticParams() {
  const products = await getProducts({ limit: 50 });

  return products.data.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(decodeSlug(slug));

  if (!product) {
    return {
      title: "محصول یافت نشد",
      robots: { index: false, follow: false },
    };
  }

  const description = (
    product.description ??
    `خرید آنلاین ${product.name} با ضمانت اصالت کالا و ارسال سریع از ${SITE.name}.`
  ).slice(0, 160);

  const image = absoluteImage(product.imageUrl);

  return {
    title: product.name,
    description,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      type: "website",
      title: product.name,
      description,
      url: `/products/${product.slug}`,
      ...(image ? { images: [{ url: image, alt: product.name }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(decodeSlug(slug));

  if (!product) notFound();

  const [images, attributes, related] = await Promise.all([
    getProductImages(product.id),
    getProductAttributeValues(product.id),
    getRelatedProducts(product.categoryId, product.id, 4),
  ]);

  const sortedGallery = [...images].sort(
    (a, b) => Number(b.isPrimary) - Number(a.isPrimary) || a.sortOrder - b.sortOrder,
  );

  const galleryImages = [
    ...(product.imageUrl &&
    !sortedGallery.some((image) => image.imageUrl === product.imageUrl)
      ? [{ id: product.id, imageUrl: product.imageUrl }]
      : []),
    ...sortedGallery.map((image) => ({ id: image.id, imageUrl: image.imageUrl })),
  ];

  const inStock = product.stock > 0;
  const productUrl = `${SITE.url}/products/${product.slug}`;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description ?? product.name,
    sku: product.sku ?? undefined,
    image: absoluteImage(product.imageUrl) ?? undefined,
    brand: product.brand ? { "@type": "Brand", name: product.brand.name } : undefined,
    category: product.category?.name,
    url: productUrl,
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "IRR",
      price: Math.round(product.price * 10),
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: SITE.name },
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "خانه", item: SITE.url },
      {
        "@type": "ListItem",
        position: 2,
        name: "فروشگاه",
        item: `${SITE.url}/products`,
      },
      { "@type": "ListItem", position: 3, name: product.name, item: productUrl },
    ],
  };

  const breadcrumbItems = [
    { label: "خانه", href: "/" },
    { label: "فروشگاه", href: "/products" },
    ...(product.category
      ? [
          {
            label: product.category.name,
            href: `/products?category=${product.category.slug}`,
          },
        ]
      : []),
    { label: product.name },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="border-b border-stone-200/80 bg-white">
        <div className="container-page py-4">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </div>

      <PageLayout
        title={product.name}
        description={product.description ?? undefined}
        breadcrumbs={breadcrumbItems}
        className="py-6 sm:py-8"
      >
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
          <ProductGallery name={product.name} images={galleryImages} />

          <div className="space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                {product.brand && <Badge tone="brand">{product.brand.name}</Badge>}
                {product.category && (
                  <Link
                    href={`/products?category=${product.category.slug}`}
                    className="rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-semibold text-stone-600 transition hover:bg-stone-200"
                  >
                    {product.category.name}
                  </Link>
                )}
                {inStock ? <Badge tone="success">موجود در انبار</Badge> : <Badge tone="danger">ناموجود</Badge>}
              </div>

              <h1 className="mt-4 text-2xl font-black leading-9 tracking-tight text-stone-900 sm:text-3xl">
                {product.name}
              </h1>

              {product.sku && <p className="mt-2 text-xs text-stone-400">کد محصول: {product.sku}</p>}
            </div>

            <SectionCard title="قیمت و خرید" className="space-y-5">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-[11px] text-stone-500">قیمت</p>
                  <p className="text-2xl font-black text-stone-900">{formatPrice(product.price)}</p>
                </div>
                <p className="text-[11px] text-stone-400">
                  {inStock ? `${formatNumber(product.stock)} عدد موجود` : "به‌زودی شارژ می‌شود"}
                </p>
              </div>
              <div className="mt-5">
                <ProductPurchasePanel
                  product={{
                    id: product.id,
                    name: product.name,
                    slug: product.slug,
                    price: product.price,
                    imageUrl: product.imageUrl,
                    stock: product.stock,
                  }}
                />
              </div>
            </SectionCard>

            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                { title: "ارسال سریع", text: "۲۴ تا ۷۲ ساعت" },
                { title: "ضمانت اصالت", text: "کالای اورجینال" },
                { title: "پشتیبانی", text: "پاسخ‌گویی سریع" },
              ].map((item) => (
                <div key={item.title} className="rounded-xl border border-stone-200/80 bg-white px-2 py-3">
                  <p className="text-[11px] font-bold text-stone-700">{item.title}</p>
                  <p className="mt-0.5 text-[10px] text-stone-400">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PageLayout>

      <section className="container-page grid gap-4 pb-6 lg:grid-cols-[minmax(0,1fr)_420px]">
        <SectionCard title="توضیحات محصول" className="sm:p-8">
          {product.description ? (
            <p className="mt-4 whitespace-pre-line text-sm leading-8 text-stone-600">{product.description}</p>
          ) : (
            <p className="mt-4 text-sm leading-7 text-stone-400">توضیحات تکمیلی برای این محصول ثبت نشده است.</p>
          )}

          <div className="mt-6 grid gap-3 text-xs text-stone-500 sm:grid-cols-2">
            <div className="rounded-xl bg-stone-50 px-4 py-3">
              تاریخ افزودن: {formatDate(product.createdAt)}
            </div>
            <div className="rounded-xl bg-stone-50 px-4 py-3">
              شناسه محصول: <span dir="ltr">{product.id.slice(0, 8)}</span>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="مشخصات">
          {attributes.length > 0 ? (
            <dl className="mt-4 divide-y divide-stone-100">
              {attributes.map((attribute) => (
                <div key={attribute.id} className="flex items-center justify-between gap-4 py-2.5">
                  <dt className="text-xs text-stone-500">{attribute.attribute?.name ?? "ویژگی"}</dt>
                  <dd className="text-xs font-bold text-stone-800">{attribute.value}</dd>
                </div>
              ))}
              {product.brand && (
                <div className="flex items-center justify-between gap-4 py-2.5">
                  <dt className="text-xs text-stone-500">برند</dt>
                  <dd className="text-xs font-bold text-stone-800">{product.brand.name}</dd>
                </div>
              )}
            </dl>
          ) : (
            <p className="mt-4 text-xs leading-6 text-stone-400">مشخصات فنی برای این محصول ثبت نشده است.</p>
          )}
        </SectionCard>
      </section>

      {related.length > 0 ? (
        <PageLayout
          title="محصولات مرتبط"
          eyebrow="پیشنهاد رولچی"
          actionLabel="مشاهده همه"
          actionHref={product.category ? `/products?category=${product.category.slug}` : "/products"}
          className="pb-10"
        >
          <ProductGrid products={related} />
        </PageLayout>
      ) : null}
    </>
  );
}