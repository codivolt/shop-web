import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Modal } from './modal';
import { ModalHeader } from './modal-header';

describe('ModalHeader', () => {
  it('renders title, description and close action', async () => {
    const onClose = vi.fn();
    render(<ModalHeader title="عنوان" description="توضیح" onClose={onClose} />);
    expect(screen.getByText('عنوان')).toBeInTheDocument();
    expect(screen.getByText('توضیح')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'بستن' }));
    expect(onClose).toHaveBeenCalledOnce();
  });
});

describe('Modal', () => {
  it('renders nothing when closed', () => {
    const { container } = render(
      <Modal open={false} onClose={() => {}} title="عنوان">
        محتوا
      </Modal>,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders a dialog with content when open', () => {
    render(
      <Modal open onClose={() => {}} title="عنوان">
        <p>محتوا</p>
      </Modal>,
    );
    expect(screen.getByRole('dialog', { name: 'عنوان' })).toBeInTheDocument();
    expect(screen.getByText('محتوا')).toBeInTheDocument();
  });

  it('closes on Escape', async () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} title="عنوان">
        محتوا
      </Modal>,
    );
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledOnce();
  });
});