import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Checkbox, Input, Select, Textarea } from './field';

describe('Input', () => {
  it('renders a label and hint', () => {
    render(<Input id="name" label="نام" hint="نام خود را وارد کنید" />);
    expect(screen.getByLabelText('نام')).toBeInTheDocument();
    expect(screen.getByText('نام خود را وارد کنید')).toBeInTheDocument();
  });

  it('shows an error and marks the input invalid', () => {
    render(<Input id="name" label="نام" error="الزامی است" />);
    expect(screen.getByText('الزامی است')).toBeInTheDocument();
    expect(screen.getByLabelText('نام')).toHaveAttribute('aria-invalid', 'true');
  });

  it('marks required labels', () => {
    render(<Input id="name" label="نام" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });
});

describe('Textarea', () => {
  it('renders a multiline field', () => {
    render(<Textarea id="bio" label="بیو" />);
    expect(screen.getByLabelText('بیو').tagName).toBe('TEXTAREA');
  });
});

describe('Select', () => {
  it('renders a placeholder and options', () => {
    render(
      <Select
        id="city"
        label="شهر"
        placeholder="انتخاب کنید"
        options={[
          { value: 'tehran', label: 'تهران' },
          { value: 'mashhad', label: 'مشهد' },
        ]}
      />,
    );
    const select = screen.getByLabelText('شهر');
    expect(select.tagName).toBe('SELECT');
    expect(screen.getAllByRole('option')).toHaveLength(3);
    expect(screen.getByRole('option', { name: 'تهران' })).toHaveValue('tehran');
  });
});

describe('Checkbox', () => {
  it('toggles when clicked', async () => {
    render(<Checkbox id="agree" label="موافقم" />);
    const checkbox = screen.getByRole('checkbox', { name: 'موافقم' });
    await userEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });
});