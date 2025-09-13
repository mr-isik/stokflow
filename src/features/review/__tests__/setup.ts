import { afterEach, beforeEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// Her test sonrası DOM'u temizle
afterEach(() => {
    cleanup();
});

// Global test konfigürasyonları
global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
};

// Window.matchMedia mock'u
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
        dispatchEvent: () => {},
    }),
});

// IntersectionObserver mock'u
(global as any).IntersectionObserver = class MockIntersectionObserver {
    root = null;
    rootMargin = '';
    thresholds = [];

    constructor() {}
    observe() {}
    disconnect() {}
    unobserve() {}
    takeRecords() {
        return [];
    }
};

// Console error/warn'ları test sırasında bastır
const originalError = console.error;
const originalWarn = console.warn;

beforeEach(() => {
    console.error = (...args: any[]) => {
        if (
            typeof args[0] === 'string' &&
            args[0].includes('Warning: ReactDOM.render is no longer supported')
        ) {
            return;
        }
        originalError.call(console, ...args);
    };

    console.warn = (...args: any[]) => {
        if (
            typeof args[0] === 'string' &&
            (args[0].includes('deprecated') || args[0].includes('Warning:'))
        ) {
            return;
        }
        originalWarn.call(console, ...args);
    };
});

afterEach(() => {
    console.error = originalError;
    console.warn = originalWarn;
});
