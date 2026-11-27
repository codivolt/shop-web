import { createElement } from 'react';

vi.mock('@/components/product/favorite-button', () => ({
  FavoriteButton: () => null,
}));
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  AddressCard,
  Card,
  CategoryCard,
  DeliveryMethodCard,
  OrderCard,
  PaymentMethodCard,
  ProductCardComponent,
} from './card';
import type { Product } from '@/lib/types';

const product: Product = {
  id: 'p1',
  categoryId: 'c1',
  brandId: null,
  name: 'توتون خشک',
  slug: 'tutun',
  description: null,
  price: 1000,
  stock: 5,
  sku: null,
  imageUrl: null,
  isActive: true,
  category: { id: 'c1', name: 'توتون', slug: 'tutun' } as Product['category'],
  brand: null,
  createdAt: '',
  updatedAt: '',
};

describe('Card', () => {
  it('renders children', () => {
    render(<Card>محتوا</Card>);
    expect(screen.getByText('محتوا')).toBeInTheDocument();
  });

  it('is keyboard accessible when clickable', async () => {
    const onClick = vi.fn();
    render(
      <Card onClick={onClick} variant="interactive">
        کلیک
      </Card>,
    );
    const card = screen.getByRole('button');
    card.focus();
    await userEvent.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledOnce();
  });
});

describe('ProductCardComponent', () => {
  it('renders the product name and price', () => {
    render(<ProductCardComponent product={product} />);
    expect(screen.getByText('توتون خشک')).toBeInTheDocument();
    expect(screen.getByText(/تومان/)).toBeInTheDocument();
  });

  it('shows an out of stock badge', () => {
    render(<ProductCardComponent product={{ ...product, stock: 0 }} />);
    expect(screen.getByText('ناموجود')).toBeInTheDocument();
  });
});

describe('CategoryCard', () => {
  it('renders name and child links', () => {
    render(
      createElement(CategoryCard, {
        name: 'توتون',
        slug: 'tutun',
        index: 0,
        ['children']: [{ name: 'پیپر', slug: 'pipe' }],
      }),
    );
    expect(screen.getByText('توتون')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'پیپر' })).toHaveAttribute(
      'href',
      '/products?category=pipe',
    );
  });
});

describe('OrderCard', () => {
  it('renders order id, status and items', () => {
    render(
      <OrderCard
        id="order-123456789"
        totalAmount={1000}
        status={{ label: 'در انتظار', className: 'x' }}
        paymentStatus={{ label: 'پرداخت نشده', className: 'y' }}
        createdAt="امروز"
        items={[{ productNameSnapshot: 'توتون' }]}
        href="/orders/1"
      />,
    );
    expect(screen.getByText(/سفارش #order-12/)).toBeInTheDocument();
    expect(screen.getByText('در انتظار')).toBeInTheDocument();
    expect(screen.getByText('توتون')).toBeInTheDocument();
  });
});

describe('AddressCard', () => {
  it('selects the address', async () => {
    const onSelect = vi.fn();
    render(
      <AddressCard
        id="a1"
        province="تهران"
        city="تهران"
        addressLine="خیابان اصلی"
        onSelect={onSelect}
      />,
    );
    await userEvent.click(screen.getByRole('radio'));
    expect(onSelect).toHaveBeenCalledOnce();
  });
});

describe('DeliveryMethodCard', () => {
  it('shows free delivery', () => {
    render(
      <DeliveryMethodCard
        id="d1"
        name="پست"
        price={0}
        onSelect={() => {}}
      />,
    );
    expect(screen.getByText('رایگان')).toBeInTheDocument();
  });
});

describe('PaymentMethodCard', () => {
  it('shows the receipt requirement', () => {
    render(
      <PaymentMethodCard
        id="pay1"
        name="کارت به کارت"
        type="card_to_card"
        requiresReceipt
        onSelect={() => {}}
      />,
    );
    expect(screen.getByText('بارگذاری فیش الزامی است')).toBeInTheDocument();
  });
});