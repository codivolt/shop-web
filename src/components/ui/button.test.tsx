import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Button, buttonStyles } from './button';

describe('Button', () => {
  it('renders children and defaults to type button', () => {
    render(<Button>ارسال</Button>);
    const button = screen.getByRole('button', { name: 'ارسال' });
    expect(button).toHaveAttribute('type', 'button');
  });

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>کلیک</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('is disabled while loading', () => {
    render(<Button loading>در حال ارسال</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('keeps an explicit type', () => {
    render(<Button type="submit">ثبت</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });
});

describe('buttonStyles', () => {
  it('combines variant, size and custom classes', () => {
    const styles = buttonStyles({ variant: 'danger', size: 'sm', className: 'x' });
    expect(styles).toContain('bg-rose-600');
    expect(styles).toContain('h-9');
    expect(styles).toContain('x');
  });
});