import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { OrderItemList, OrderSummary } from './order-summary';
import type { CartItem } from '@/lib/types';

const item: CartItem = {
  id: 'line-1',
  productId: 'p1',
  product: {
    id: 'p1',
    name: 'توتون',
    slug: 'tutun',
    price: 1000,
    imageUrl: null,
    stock: 5,
  },
  quantity: 2,
  totalPrice: 2000,
};

describe('OrderSummary', () => {
  it('renders the breakdown and total', () => {
    render(
      <OrderSummary
        items={[item]}
        subtotal={2000}
        deliveryPrice={0}
        totalAmount={2000}
        deliveryLabel="ارسال"
        actionLabel="ادامه"
        actionHref="/checkout"
      />,
    );
    expect(screen.getByText('خلاصه سفارش')).toBeInTheDocument();
    expect(screen.getByText('جمع کالاها')).toBeInTheDocument();
    expect(screen.getByText('رایگان')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /ادامه/ })).toHaveAttribute('href', '/checkout');
  });

  it('calls onAction instead of navigating', async () => {
    const onAction = vi.fn();
    render(
      <OrderSummary
        items={[item]}
        subtotal={2000}
        deliveryPrice={0}
        totalAmount={2000}
        actionLabel="ثبت"
        actionHref="/checkout"
        onAction={onAction}
      />,
    );
    await userEvent.click(screen.getByRole('link', { name: /ثبت/ }));
    expect(onAction).toHaveBeenCalledOnce();
  });

  it('hides the breakdown when disabled', () => {
    render(
      <OrderSummary
        items={[item]}
        subtotal={2000}
        deliveryPrice={0}
        totalAmount={2000}
        actionLabel="ادامه"
        showBreakdown={false}
      />,
    );
    expect(screen.queryByText('جمع کالاها')).not.toBeInTheDocument();
  });
});

describe('OrderItemList', () => {
  it('renders each item with quantity and total', () => {
    render(<OrderItemList items={[item]} />);
    expect(screen.getByText('توتون')).toBeInTheDocument();
    expect(screen.getByText(/۲ ×/)).toBeInTheDocument();
  });
});