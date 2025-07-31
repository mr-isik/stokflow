import { Input as HeroInput, InputProps } from '@heroui/react';
import { forwardRef } from 'react';
import { FieldError } from 'react-hook-form';

interface FormInputProps
    extends Omit<InputProps, 'errorMessage' | 'isInvalid'> {
    error?: string | FieldError;
    label: string;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
    ({ error, label, ...props }, ref) => {
        const errorMessage = typeof error === 'string' ? error : error?.message;

        return (
            <HeroInput
                ref={ref}
                label={label}
                errorMessage={errorMessage}
                isInvalid={!!errorMessage}
                variant="bordered"
                size="md"
                classNames={{
                    input: 'text-base',
                    inputWrapper: [
                        'border-default-200',
                        'data-[hover=true]:border-primary-300',
                        'data-[focus=true]:border-primary-500',
                        'group-data-[focus=true]:border-primary-500',
                        'transition-all',
                        'duration-200',
                    ],
                    label: [
                        'text-default-600',
                        'group-data-[filled-within=true]:text-primary-600',
                    ],
                    errorMessage: 'text-danger-500 text-sm',
                }}
                {...props}
            />
        );
    }
);

FormInput.displayName = 'FormInput';

FormInput.displayName = 'FormInput';
