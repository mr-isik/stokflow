import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { ProductCardSkeleton, ProductsSkeleton } from '../ui/product-skeleton';
import { render } from './test-utilities';

describe('Product Skeleton Components', () => {
    describe('ProductCardSkeleton', () => {
        it('renders skeleton elements', () => {
            render(<ProductCardSkeleton />);

            expect(
                screen.getByTestId('product-card-skeleton')
            ).toBeInTheDocument();
            expect(screen.getByTestId('image-skeleton')).toBeInTheDocument();
        });

        it('has correct card structure', () => {
            const { container } = render(<ProductCardSkeleton />);

            expect(container.querySelector('.border')).toBeInTheDocument();
        });

        it('displays multiple skeleton elements for different content areas', () => {
            render(<ProductCardSkeleton />);

            // Should have skeletons for all areas
            expect(screen.getByTestId('image-skeleton')).toBeInTheDocument();
            expect(screen.getByTestId('title-skeleton')).toBeInTheDocument();
            expect(screen.getByTestId('subtitle-skeleton')).toBeInTheDocument();
            expect(screen.getByTestId('price-skeleton')).toBeInTheDocument();
            expect(screen.getByTestId('button-skeleton')).toBeInTheDocument();
        });
    });

    describe('ProductsSkeleton', () => {
        it('renders default count of skeleton cards', () => {
            render(<ProductsSkeleton />);

            expect(screen.getByTestId('products-skeleton')).toBeInTheDocument();
            const cards = screen
                .getByTestId('products-skeleton')
                .querySelectorAll('[data-testid="product-card-skeleton"]');
            expect(cards).toHaveLength(10); // Default count
        });

        it('renders custom number of skeleton cards', () => {
            render(<ProductsSkeleton count={5} />);

            const cards = screen
                .getByTestId('products-skeleton')
                .querySelectorAll('[data-testid="product-card-skeleton"]');
            expect(cards).toHaveLength(5);
        });

        it('renders zero skeleton cards when count is 0', () => {
            render(<ProductsSkeleton count={0} />);

            const cards = screen
                .getByTestId('products-skeleton')
                .querySelectorAll('[data-testid="product-card-skeleton"]');
            expect(cards).toHaveLength(0);
        });

        it('applies grid layout classes', () => {
            render(<ProductsSkeleton />);

            const gridContainer = screen.getByTestId('products-skeleton');
            expect(gridContainer).toHaveClass('grid', 'gap-6');
        });

        it('has responsive grid columns', () => {
            render(<ProductsSkeleton />);

            const gridContainer = screen.getByTestId('products-skeleton');
            expect(gridContainer).toHaveClass(
                'grid-cols-2',
                'md:grid-cols-3',
                'lg:grid-cols-4',
                'xl:grid-cols-5'
            );
        });

        it('applies custom count with different values', () => {
            const testCounts = [1, 3, 8, 15];

            testCounts.forEach(count => {
                const { unmount } = render(<ProductsSkeleton count={count} />);

                const cards = screen
                    .getByTestId('products-skeleton')
                    .querySelectorAll('[data-testid="product-card-skeleton"]');
                expect(cards).toHaveLength(count);

                unmount();
            });
        });
    });
});
