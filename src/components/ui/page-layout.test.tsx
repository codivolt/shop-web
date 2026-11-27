import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import { FeatureCard, InfoCard, PageLayout, SectionCard, StatCard } from './page-layout';

describe('PageLayout', () => {
  it('renders title, description and content', () => {
    render(
      <PageLayout title="حساب کاربری" description="توضیح">
        <p>محتوا</p>
      </PageLayout>,
    );
    expect(screen.getByRole('heading', { name: 'حساب کاربری' })).toBeInTheDocument();
    expect(screen.getByText('توضیح')).toBeInTheDocument();
    expect(screen.getByText('محتوا')).toBeInTheDocument();
  });

  it('renders breadcrumbs and an action', () => {
    render(
      <PageLayout
        title="سفارشات"
        breadcrumbs={[{ label: 'خانه', href: '/' }, { label: 'سفارشات' }]}
        actionLabel="سفارش جدید"
        actionHref="/checkout"
      >
        <p>محتوا</p>
      </PageLayout>,
    );
    expect(screen.getByRole('link', { name: 'خانه' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /سفارش جدید/ })).toHaveAttribute('href', '/checkout');
  });
});

describe('SectionCard', () => {
  it('renders header, children and footer', () => {
    render(
      <SectionCard title="اطلاعات" description="توضیح" footer={<p>فوتر</p>}>
        <p>بدنه</p>
      </SectionCard>,
    );
    expect(screen.getByText('اطلاعات')).toBeInTheDocument();
    expect(screen.getByText('بدنه')).toBeInTheDocument();
    expect(screen.getByText('فوتر')).toBeInTheDocument();
  });
});

describe('InfoCard', () => {
  it('renders label and value', () => {
    render(<InfoCard label="فروش" value="۱۰۰" />);
    expect(screen.getByText('فروش')).toBeInTheDocument();
    expect(screen.getByText('۱۰۰')).toBeInTheDocument();
  });

  it('shows an up trend arrow', () => {
    render(<InfoCard label="فروش" value="۱۰۰" trend="up" />);
    expect(screen.getByText('↑')).toBeInTheDocument();
  });
});

describe('FeatureCard', () => {
  it('renders title, description and action', () => {
    render(
      <FeatureCard
        title="ارسال سریع"
        description="به سراسر ایران"
        icon={<span>i</span>}
        actionLabel="بیشتر"
        actionHref="/shipping"
      />,
    );
    expect(screen.getByText('ارسال سریع')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /بیشتر/ })).toHaveAttribute('href', '/shipping');
  });
});

describe('StatCard', () => {
  it('renders value with unit and description', () => {
    render(<StatCard label="تعداد" value={12} unit="عدد" description="این ماه" />);
    expect(screen.getByText('تعداد')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('عدد')).toBeInTheDocument();
    expect(screen.getByText('این ماه')).toBeInTheDocument();
  });
});