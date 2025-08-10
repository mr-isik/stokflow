import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import ProductPrice from '../ui/product-card/product-price';
import { render } from './test-utilities';

describe('ProductPrice', () => {
    it('displays price correctly', () => {
        const variants = [{ price: 99.99 }];

        render(<ProductPrice variants={variants} />);

        expect(screen.getByText('99.99 TL')).toBeInTheDocument();
    });

    it('displays zero price', () => {
        const variants = [{ price: 0 }];

        render(<ProductPrice variants={variants} />);

        expect(screen.getByText('0 TL')).toBeInTheDocument();
    });

    it('displays large price numbers', () => {
        const variants = [{ price: 999999.99 }];

        render(<ProductPrice variants={variants} />);

        expect(screen.getByText('999999.99 TL')).toBeInTheDocument();
    });

    it('uses first variant when multiple variants exist', () => {
        const variants = [
            { price: 99.99 },
            { price: 149.99 },
            { price: 199.99 },
        ];

        render(<ProductPrice variants={variants} />);

        expect(screen.getByText('99.99 TL')).toBeInTheDocument();
        expect(screen.queryByText('149.99 TL')).not.toBeInTheDocument();
    });

    it('applies correct styling classes', () => {
        const variants = [{ price: 99.99 }];

        render(<ProductPrice variants={variants} />);

        const priceElement = screen.getByText('99.99 TL');
        expect(priceElement).toHaveClass('font-semibold', 'text-primary');
    });

    it('handles decimal prices correctly', () => {
        const variants = [{ price: 29.5 }];

        render(<ProductPrice variants={variants} />);

        expect(screen.getByText('29.5 TL')).toBeInTheDocument();
    });
});
