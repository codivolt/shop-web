import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { ProgressSteps, StepIndicator } from './step-indicator';

const steps = [
  { label: 'اطلاعات', completed: true },
  { label: 'پرداخت', active: true },
  { label: 'تایید' },
];

describe('StepIndicator', () => {
  it('renders horizontal steps with labels', () => {
    render(<StepIndicator steps={steps} currentStep={1} />);
    expect(screen.getByText('اطلاعات')).toBeInTheDocument();
    expect(screen.getByText('پرداخت')).toBeInTheDocument();
    expect(screen.getByText('تایید')).toBeInTheDocument();
  });

  it('renders vertical steps', () => {
    const { container } = render(
      <StepIndicator steps={steps} currentStep={1} orientation="vertical" />,
    );
    expect(container.querySelector('ol')).toHaveClass('space-y-6');
  });

  it('hides numbers when showNumbers is false', () => {
    render(<StepIndicator steps={[{ label: 'یک' }]} currentStep={0} showNumbers={false} />);
    expect(screen.queryByText('1')).not.toBeInTheDocument();
  });
});

describe('ProgressSteps', () => {
  it('renders labels and completed state', () => {
    render(
      <ProgressSteps
        steps={[
          { label: 'سبد', completed: true },
          { label: 'آدرس', active: true },
        ]}
      />,
    );
    expect(screen.getByText('سبد')).toBeInTheDocument();
    expect(screen.getByText('آدرس')).toBeInTheDocument();
  });
});