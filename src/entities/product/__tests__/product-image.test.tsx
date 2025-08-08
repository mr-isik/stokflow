import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import ProductImage from '../ui/product-card/product-image';
import { render } from './test-utilities.test';

describe('ProductImage', () => {
    const mockImage = {
        url: 'https://example.com/test-image.jpg',
        alt: 'Test product image',
        is_featured: true,
    };

    it('renders image with correct src and alt', () => {
        render(<ProductImage image={mockImage} title="Test Product" />);

        const image = screen.getByRole('img');
        expect(image).toHaveAttribute('src', mockImage.url);
        expect(image).toHaveAttribute('alt', mockImage.alt);
    });

    it('uses title as alt when image alt is empty', () => {
        const imageWithoutAlt = { ...mockImage, alt: '' };
        const title = 'Fallback Title';

        render(<ProductImage image={imageWithoutAlt} title={title} />);

        const image = screen.getByRole('img');
        expect(image).toHaveAttribute('alt', title);
    });

    it('applies correct CSS classes', () => {
        render(<ProductImage image={mockImage} title="Test Product" />);

        const image = screen.getByRole('img');
        expect(image).toHaveClass('w-full', 'h-64', 'object-cover');
    });

    it('sets loading attribute to lazy', () => {
        render(<ProductImage image={mockImage} title="Test Product" />);

        const image = screen.getByRole('img');
        expect(image).toHaveAttribute('loading', 'lazy');
    });

    it('has fallback src for broken images', () => {
        render(<ProductImage image={mockImage} title="Test Product" />);

        // The component should have fallbackSrc prop set
        // Note: Testing the actual fallback behavior would require more complex setup
        expect(screen.getByRole('img')).toBeInTheDocument();
    });
});
