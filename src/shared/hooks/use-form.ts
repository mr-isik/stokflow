import { useState } from 'react';
import { z } from 'zod';

interface UseFormOptions<T> {
    schema: z.ZodSchema<T>;
    onSubmit: (data: T) => Promise<void> | void;
    defaultValues?: Partial<T>;
}

interface UseFormReturn<T> {
    values: Partial<T>;
    errors: Record<string, string>;
    isSubmitting: boolean;
    isValid: boolean;
    setValue: (field: keyof T, value: unknown) => void;
    setError: (field: keyof T, message: string) => void;
    clearErrors: () => void;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    reset: () => void;
}

export function useForm<T extends Record<string, unknown>>({
    schema,
    onSubmit,
    defaultValues = {},
}: UseFormOptions<T>): UseFormReturn<T> {
    const [values, setValues] = useState<Partial<T>>(defaultValues);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const setValue = (field: keyof T, value: unknown) => {
        setValues(prev => ({
            ...prev,
            [field]: value,
        }));

        // Clear error when user starts typing
        if (errors[field as string]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field as string];
                return newErrors;
            });
        }
    };

    const setError = (field: keyof T, message: string) => {
        setErrors(prev => ({
            ...prev,
            [field as string]: message,
        }));
    };

    const clearErrors = () => {
        setErrors({});
    };

    const reset = () => {
        setValues(defaultValues);
        setErrors({});
        setIsSubmitting(false);
    };

    const validate = (): boolean => {
        try {
            schema.parse(values);
            clearErrors();
            return true;
        } catch (error) {
            if (error instanceof z.ZodError) {
                const newErrors: Record<string, string> = {};
                error.issues.forEach(issue => {
                    if (issue.path[0]) {
                        newErrors[issue.path[0] as string] = issue.message;
                    }
                });
                setErrors(newErrors);
            }
            return false;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmit(values as T);
        } catch (error) {
            // Handle submission errors
            console.error('Form submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const isValid =
        Object.keys(errors).length === 0 &&
        Object.keys(values).length > 0 &&
        schema.safeParse(values).success;

    return {
        values,
        errors,
        isSubmitting,
        isValid,
        setValue,
        setError,
        clearErrors,
        handleSubmit,
        reset,
    };
}
