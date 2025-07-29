import { z } from "zod";

// Base validation utilities
export const createValidator = <T>(schema: z.ZodSchema<T>) => {
  return {
    validate: (data: unknown) => schema.safeParse(data),
    validateAsync: async (data: unknown) => schema.safeParseAsync(data),
    validateOrThrow: (data: unknown) => schema.parse(data),
  };
};

export const CommonSchemas = {
  email: z.string().email("Geçerli bir email adresi giriniz"),
  phone: z
    .string()
    .regex(/^(\+90|0)?[0-9]{10}$/, "Geçerli telefon numarası giriniz"),
  password: z
    .string()
    .min(8, "Şifre en az 8 karakter olmalı")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Şifre büyük harf, küçük harf ve rakam içermeli"
    ),
  url: z.string().url("Geçerli URL giriniz"),
  positiveNumber: z.number().positive("Pozitif sayı olmalı"),
  currency: z.number().min(0, "Fiyat negatif olamaz").multipleOf(0.01),
  id: z.string().min(1, "ID gerekli"),
  nonEmptyString: z.string().min(1, "Bu alan boş olamaz"),
};

// Generic API response wrapper
export const ApiResponseSchema = <T>(dataSchema: z.ZodSchema<T>) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    message: z.string().optional(),
    errors: z.array(z.string()).optional(),
    meta: z
      .object({
        timestamp: z.string(),
        requestId: z.string().optional(),
        page: z.number().optional(),
        limit: z.number().optional(),
        total: z.number().optional(),
      })
      .optional(),
  });

// Paginated response schema
export const PaginatedResponseSchema = <T>(itemSchema: z.ZodSchema<T>) =>
  ApiResponseSchema(
    z.object({
      items: z.array(itemSchema),
      pagination: z.object({
        page: z.number(),
        limit: z.number(),
        total: z.number(),
        totalPages: z.number(),
      }),
    })
  );

// Validation result type
export interface ValidationResult<T> {
  isValid: boolean;
  data: T | null;
  errors: string[];
}

// API validation function
export const validateApiResponse = <T>(
  schema: z.ZodSchema<T>,
  response: unknown,
  context?: { endpoint?: string; method?: string }
): ValidationResult<T> => {
  try {
    const result = schema.safeParse(response);

    if (result.success) {
      return { isValid: true, data: result.data, errors: [] };
    } else {
      const errors = result.error.issues.map(
        (err: any) => `${err.path.join(".")}: ${err.message}`
      );

      console.warn("API response validation failed:", {
        context,
        errors,
        response:
          process.env.NODE_ENV === "development"
            ? response
            : "[hidden in production]",
      });

      return { isValid: false, data: null, errors };
    }
  } catch (error) {
    console.error("API validation error:", { context, error });
    return {
      isValid: false,
      data: null,
      errors: ["Validation error occurred"],
    };
  }
};

// Validation error class
export class ValidationError extends Error {
  constructor(message: string, public errors: string[], public context?: any) {
    super(message);
    this.name = "ValidationError";
  }
}
