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
        render(<ProductActions onAddToCart={mockOnAddToCart} />);

        expect(screen.getByText('Sepete Ekle')).toBeInTheDocument();
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('calls onAddToCart when button is clicked', async () => {
        const user = userEvent.setup();

        render(<ProductActions onAddToCart={mockOnAddToCart} />);

        const button = screen.getByRole('button');
        await user.click(button);

        expect(mockOnAddToCart).toHaveBeenCalledTimes(1);
    });

    it('shows loading state when isLoading is true', () => {
        render(
            <ProductActions onAddToCart={mockOnAddToCart} isLoading={true} />
        );

        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
    });

    it('is not disabled when isLoading is false', () => {
        render(
            <ProductActions onAddToCart={mockOnAddToCart} isLoading={false} />
        );

        const button = screen.getByRole('button');
        expect(button).not.toBeDisabled();
    });

    it('has correct styling classes', () => {
        render(<ProductActions onAddToCart={mockOnAddToCart} />);

        const container = screen.getByText('Sepete Ekle').closest('div');
        expect(container).toHaveClass('opacity-0', 'group-hover:opacity-100');
    });

    it('displays cart icon', () => {
        render(<ProductActions onAddToCart={mockOnAddToCart} />);

        // The icon should be rendered (IoCartOutline)
        const button = screen.getByRole('button');
        expect(button.querySelector('svg')).toBeInTheDocument();
    });

    it('handles multiple rapid clicks', async () => {
        render(<ProductActions onAddToCart={mockOnAddToCart} />);

        const button = screen.getByRole('button');

        fireEvent.click(button);
        fireEvent.click(button);
        fireEvent.click(button);

        expect(mockOnAddToCart).toHaveBeenCalledTimes(3);
    });

    it('has correct button size', () => {
        render(<ProductActions onAddToCart={mockOnAddToCart} />);

        const button = screen.getByRole('button');
        expect(button).toHaveClass('flex-1');
    });
});
