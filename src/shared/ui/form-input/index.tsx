import { Input as HeroInput, InputProps } from '@heroui/react';
import { forwardRef } from 'react';

interface FormInputProps
    extends Omit<InputProps, 'errorMessage' | 'isInvalid'> {
    error?: string;
    label: string;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
    ({ error, label, ...props }, ref) => {
        return (
            <HeroInput
                ref={ref}
                label={label}
                errorMessage={error}
                isInvalid={!!error}
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
