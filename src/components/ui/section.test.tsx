import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { Breadcrumbs, InfoRow, SectionHeading } from './section';

describe('SectionHeading', () => {
  it('renders title, eyebrow and description', () => {
    render(
      <SectionHeading eyebrow="جدید" title="محصولات" description="توضیح" />,
    );
    expect(screen.getByText('جدید')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'محصولات' })).toBeInTheDocument();
    expect(screen.getByText('توضیح')).toBeInTheDocument();
  });

  it('renders an action link', () => {
    render(
      <SectionHeading title="محصولات" actionLabel="مشاهده همه" actionHref="/products" />,
    );
    expect(screen.getByRole('link', { name: /مشاهده همه/ })).toHaveAttribute('href', '/products');
  });
});

describe('Breadcrumbs', () => {
  it('renders links and the current page', () => {
    render(
      <Breadcrumbs
        items={[
          { label: 'خانه', href: '/' },
          { label: 'محصولات' },
        ]}
      />,
    );
    expect(screen.getByRole('link', { name: 'خانه' })).toBeInTheDocument();
    expect(screen.getByText('محصولات')).toBeInTheDocument();
  });
});

describe('InfoRow', () => {
  it('renders a label and value', () => {
    render(<InfoRow label="وضعیت" value="فعال" />);
    expect(screen.getByText('وضعیت')).toBeInTheDocument();
    expect(screen.getByText('فعال')).toBeInTheDocument();
  });

  it('prefers children over value', () => {
    render(
      <InfoRow label="مبلغ">
        <span>جدید</span>
      </InfoRow>,
    );
    expect(screen.getByText('جدید')).toBeInTheDocument();
    expect(screen.queryByText('قدیمی')).not.toBeInTheDocument();
  });
});