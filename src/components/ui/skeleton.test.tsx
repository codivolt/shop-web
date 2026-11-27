import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';

import { ProductCardSkeleton, ProductGridSkeleton, Skeleton } from './skeleton';

describe('Skeleton', () => {
  it('renders a pulse placeholder', () => {
    const { container } = render(<Skeleton className="h-4" />);
    expect(container.firstChild).toHaveClass('animate-pulse', 'h-4');
  });
});

describe('ProductGridSkeleton', () => {
  it('renders the requested number of cards', () => {
    const { container } = render(<ProductGridSkeleton count={3} />);
    expect(container.querySelectorAll('.rounded-2xl')).toHaveLength(3);
  });

  it('defaults to eight cards', () => {
    const { container } = render(<ProductGridSkeleton />);
    expect(container.querySelectorAll('.rounded-2xl')).toHaveLength(8);
  });
});

describe('ProductCardSkeleton', () => {
  it('renders image and text placeholders', () => {
    const { container } = render(<ProductCardSkeleton />);
    expect(container.querySelectorAll('.animate-pulse')).toHaveLength(4);
  });
});