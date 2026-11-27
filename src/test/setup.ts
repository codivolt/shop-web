import '@testing-library/jest-dom/vitest';
import { createElement } from 'react';
import { vi } from 'vitest';

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: { children?: unknown; href?: string }) =>
    createElement('a', { href, ...props }, children as never),
}));

vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: { src?: string; alt?: string }) =>
    createElement('img', { src, alt, ...props }),
}));

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

window.scrollTo = () => {};