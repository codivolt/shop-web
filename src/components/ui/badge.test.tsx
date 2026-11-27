import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { Badge, StatusBadge } from './badge';

describe('Badge', () => {
  it('renders children with the default tone', () => {
    render(<Badge>متن</Badge>);
    expect(screen.getByText('متن')).toHaveClass('bg-white/10');
  });

  it('applies the requested tone', () => {
    render(<Badge tone="danger">حذف</Badge>);
    expect(screen.getByText('حذف')).toHaveClass('text-rose-300');
  });

  it('merges custom class names', () => {
    render(<Badge className="custom">برچسب</Badge>);
    expect(screen.getByText('برچسب')).toHaveClass('custom');
  });
});

describe('StatusBadge', () => {
  it('renders the label with a dot', () => {
    render(<StatusBadge label="فعال" />);
    expect(screen.getByText('فعال')).toBeInTheDocument();
  });
});