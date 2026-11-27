import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { BrandsSection } from './brands-section';
import { FeaturesStrip } from './features-strip';
import { JoinSection } from './join-section';
import type { Brand } from '@/lib/types';

describe('JoinSection', () => {
  it('renders the heading and login link', () => {
    render(<JoinSection />);
    expect(screen.getByText('عضو خانواده رولچی شو')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'ورود به حساب' })).toHaveAttribute(
      'href',
      '/login',
    );
  });
});

describe('BrandsSection', () => {
  it('renders nothing without brands', () => {
    const { container } = render(<BrandsSection brands={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders a link per brand', () => {
    const brands: Brand[] = [
      { id: 'b1', name: 'برند یک', slug: 'brand-1' } as Brand,
    ];
    render(<BrandsSection brands={brands} />);
    expect(screen.getByRole('link', { name: 'برند یک' })).toHaveAttribute(
      'href',
      '/products?brand=brand-1',
    );
  });
});

describe('FeaturesStrip', () => {
  it('renders the configured features', () => {
    const { container } = render(<FeaturesStrip />);
    expect(container.querySelectorAll('.rounded-2xl').length).toBeGreaterThan(0);
  });
});