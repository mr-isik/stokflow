import {
    useForm,
    UseFormProps,
    UseFormReturn,
    FieldValues,
    SubmitHandler,
    FieldErrors,
    DefaultValues,
} from 'react-hook-form';
import { ZodType } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback } from 'react';

interface UseFormHandlerProps<T extends FieldValues, S extends ZodType<T>> {
    schema: S;
    defaultValues?: UseFormProps<T>['defaultValues'];
    mode?: UseFormProps<T>['mode'];
}

export function useFormHandler<T extends FieldValues, S extends ZodType<T>>({
    schema,
    defaultValues,
    mode = 'onSubmit',
}: UseFormHandlerProps<T, S>): UseFormReturn<T> & {
    handleSubmit: (
        onValid: SubmitHandler<T>,
        onInvalid?: (errors: FieldErrors<T>) => void
    ) => (e?: React.BaseSyntheticEvent) => Promise<void>;
    values: T;
    errors: FieldErrors<T>;
    isSubmitting: boolean;
    resetForm: () => void;
    setValues: (newValues: Partial<T>) => void;
    form: UseFormReturn<T>;
} {
    const methods = useForm<T>({
        /* @ts-ignore */
        resolver: zodResolver(schema),
        defaultValues,
        mode,
    });

    function handleSubmit(
        onValid: SubmitHandler<T>,
        onInvalid?: (errors: FieldErrors<T>) => void
    ) {
        return (e?: React.BaseSyntheticEvent) => {
            e?.preventDefault();
            // @ts-ignore
            return methods.handleSubmit(onValid, onInvalid)(e);
        };
    }

    const values = methods.watch();
    const errors = methods.formState.errors;
    const isSubmitting = methods.formState.isSubmitting;

    const resetForm = useCallback(() => {
        if (defaultValues) {
            methods.reset(defaultValues as T | DefaultValues<T>);
        } else {
            methods.reset();
        }
    }, [methods, defaultValues]);

    const setValues = useCallback(
        (newValues: Partial<T>) => {
            methods.reset({ ...values, ...newValues });
        },
        [methods, values]
    );

    return {
        ...methods,
        handleSubmit,
        values,
        errors,
        isSubmitting,
        resetForm,
        setValues,
        // @ts-ignore
        form: methods,
        // React Hook Form'un tüm metodlarını da direkt döndür
        register: methods.register,
        setValue: methods.setValue,
        watch: methods.watch,
        reset: methods.reset,
        formState: methods.formState,
    };
}
