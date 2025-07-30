import { Button as HeroButton, ButtonProps } from '@heroui/react';
import { forwardRef } from 'react';

interface FormButtonProps extends ButtonProps {
    isLoading?: boolean;
    children: React.ReactNode;
}

export const FormButton = forwardRef<HTMLButtonElement, FormButtonProps>(
    ({ isLoading = false, children, disabled, ...props }, ref) => {
        return (
            <HeroButton
                ref={ref}
                type="submit"
                color="primary"
                size="md"
                isLoading={isLoading}
                disabled={disabled || isLoading}
                className="w-full font-semibold"
                {...props}
            >
                {children}
            </HeroButton>
        );
    }
);

FormButton.displayName = 'FormButton';
