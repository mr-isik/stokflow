import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductActions from '../ui/product-card/product-actions';
import { render } from './test-utilities';

describe('ProductActions', () => {
    const mockOnAddToCart = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders add to cart button', () => {
        render(<ProductActions variantId={1} />);

        expect(screen.getByText('Sepete Ekle')).toBeInTheDocument();
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('is not disabled when isLoading is false', () => {
        render(<ProductActions variantId={1} />);

        const button = screen.getByRole('button');
        expect(button).not.toBeDisabled();
    });

    it('has correct styling classes', () => {
        render(<ProductActions variantId={1} />);

        const container = screen.getByText('Sepete Ekle').closest('div');
        expect(container).toHaveClass('opacity-0', 'group-hover:opacity-100');
    });

    it('displays cart icon', () => {
        render(<ProductActions variantId={1} />);

        // The icon should be rendered (IoCartOutline)
        const button = screen.getByRole('button');
        expect(button.querySelector('svg')).toBeInTheDocument();
    });
});
