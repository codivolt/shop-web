import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { EmptyState } from './empty-state';

describe('EmptyState', () => {
  it('renders title and description', () => {
    render(<EmptyState title="چیزی نیست" description="بعداً اضافه کنید" />);
    expect(screen.getByText('چیزی نیست')).toBeInTheDocument();
    expect(screen.getByText('بعداً اضافه کنید')).toBeInTheDocument();
  });

  it('renders an action link when provided', () => {
    render(<EmptyState title="خالی" actionLabel="افزودن" actionHref="/new" />);
    expect(screen.getByRole('link', { name: 'افزودن' })).toHaveAttribute('href', '/new');
  });

  it('renders custom children', () => {
    render(
      <EmptyState title="خالی">
        <button>دکمه</button>
      </EmptyState>,
    );
    expect(screen.getByRole('button', { name: 'دکمه' })).toBeInTheDocument();
  });
});