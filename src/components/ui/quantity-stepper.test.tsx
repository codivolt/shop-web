import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { QuantityStepper } from './quantity-stepper';

describe('QuantityStepper', () => {
  it('increments and decrements within bounds', async () => {
    const onChange = vi.fn();
    render(<QuantityStepper value={2} onChange={onChange} min={1} max={3} />);

    await userEvent.click(screen.getByRole('button', { name: 'افزایش تعداد' }));
    expect(onChange).toHaveBeenLastCalledWith(3);

    await userEvent.click(screen.getByRole('button', { name: 'کاهش تعداد' }));
    expect(onChange).toHaveBeenLastCalledWith(1);
  });

  it('disables the increase button at max', () => {
    render(<QuantityStepper value={3} onChange={() => {}} max={3} />);
    expect(screen.getByRole('button', { name: 'افزایش تعداد' })).toBeDisabled();
  });

  it('disables the decrease button at min', () => {
    render(<QuantityStepper value={1} onChange={() => {}} min={1} />);
    expect(screen.getByRole('button', { name: 'کاهش تعداد' })).toBeDisabled();
  });

  it('respects the disabled prop', () => {
    render(<QuantityStepper value={2} onChange={() => {}} disabled />);
    expect(screen.getByRole('button', { name: 'افزایش تعداد' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'کاهش تعداد' })).toBeDisabled();
  });
});