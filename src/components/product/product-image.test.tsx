import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { ProductImage } from './product-image';

describe('ProductImage', () => {
  it('renders a placeholder when there is no source', () => {
    render(<ProductImage src={null} alt="محصول" sizes="100px" />);
    expect(screen.getByText('بدون تصویر')).toBeInTheDocument();
  });

  it('renders an image for a relative source', () => {
    render(<ProductImage src="/images/p.jpg" alt="محصول" sizes="100px" />);
    const image = screen.getByRole('img', { name: 'محصول' });
    expect(image).toHaveAttribute('src', expect.stringContaining('/images/p.jpg'));
  });

  it('keeps absolute sources untouched', () => {
    render(
      <ProductImage src="https://cdn.example.com/p.jpg" alt="محصول" sizes="100px" />,
    );
    expect(screen.getByRole('img')).toHaveAttribute(
      'src',
      'https://cdn.example.com/p.jpg',
    );
  });
});