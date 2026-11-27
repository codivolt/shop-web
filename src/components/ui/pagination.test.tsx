import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { Pagination } from './pagination';

describe('Pagination', () => {
  it('renders nothing for a single page', () => {
    const { container } = render(
      <Pagination page={1} totalPages={1} makeHref={(p) => `/p/${p}`} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders page links and the current page', () => {
    render(<Pagination page={2} totalPages={3} makeHref={(p) => `/p/${p}`} />);
    expect(screen.getByRole('link', { name: '۲' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'قبلی' })).toHaveAttribute('href', '/p/1');
    expect(screen.getByRole('link', { name: 'بعدی' })).toHaveAttribute('href', '/p/3');
  });

  it('omits previous on the first page and next on the last', () => {
    const { rerender } = render(
      <Pagination page={1} totalPages={3} makeHref={(p) => `/p/${p}`} />,
    );
    expect(screen.queryByRole('link', { name: 'قبلی' })).not.toBeInTheDocument();

    rerender(<Pagination page={3} totalPages={3} makeHref={(p) => `/p/${p}`} />);
    expect(screen.queryByRole('link', { name: 'بعدی' })).not.toBeInTheDocument();
  });

  it('collapses long ranges with dots', () => {
    render(<Pagination page={10} totalPages={20} makeHref={(p) => `/p/${p}`} />);
    expect(screen.getAllByText('…').length).toBeGreaterThan(0);
  });
});