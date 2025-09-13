import { describe, it, expect } from 'vitest';
import { reviewFormSchema } from '../model';

describe('Review Form Model', () => {
    describe('reviewFormSchema', () => {
        describe('Rating Validation', () => {
            it('should accept valid rating values (1-5)', () => {
                for (let rating = 1; rating <= 5; rating++) {
                    const result = reviewFormSchema.safeParse({
                        rating,
                        comment: 'Bu ürün hakkında düşüncelerim...',
                    });
                    expect(result.success).toBe(true);
                }
            });

            it('should reject rating below 1', () => {
                const result = reviewFormSchema.safeParse({
                    rating: 0,
                    comment: 'Bu ürün hakkında düşüncelerim...',
                });
                expect(result.success).toBe(false);
                if (!result.success) {
                    expect(result.error.issues[0].message).toBe(
                        'Lütfen bir puan verin'
                    );
                }
            });

            it('should reject rating above 5', () => {
                const result = reviewFormSchema.safeParse({
                    rating: 6,
                    comment: 'Bu ürün hakkında düşüncelerim...',
                });
                expect(result.success).toBe(false);
                if (!result.success) {
                    expect(result.error.issues[0].message).toBe(
                        'Maksimum 5 puan verilebilir'
                    );
                }
            });

            it('should reject non-numeric rating', () => {
                const result = reviewFormSchema.safeParse({
                    rating: 'invalid',
                    comment: 'Bu ürün hakkında düşüncelerim...',
                });
                expect(result.success).toBe(false);
            });

            it('should reject missing rating', () => {
                const result = reviewFormSchema.safeParse({
                    comment: 'Bu ürün hakkında düşüncelerim...',
                });
                expect(result.success).toBe(false);
            });
        });

        describe('Comment Validation', () => {
            it('should accept valid comment', () => {
                const result = reviewFormSchema.safeParse({
                    rating: 4,
                    comment:
                        'Bu ürün gerçekten çok iyi, herkese tavsiye ederim.',
                });
                expect(result.success).toBe(true);
            });

            it('should reject comment shorter than 10 characters', () => {
                const result = reviewFormSchema.safeParse({
                    rating: 4,
                    comment: 'Kısa',
                });
                expect(result.success).toBe(false);
            });

            it('should accept comment exactly 10 characters', () => {
                const result = reviewFormSchema.safeParse({
                    rating: 4,
                    comment: '1234567890', // Exactly 10 characters
                });
                expect(result.success).toBe(true);
            });

            it('should reject comment longer than 500 characters', () => {
                const longComment = 'a'.repeat(501);
                const result = reviewFormSchema.safeParse({
                    rating: 4,
                    comment: longComment,
                });
                expect(result.success).toBe(false);
            });

            it('should accept comment exactly 500 characters', () => {
                const longComment = 'a'.repeat(500);
                const result = reviewFormSchema.safeParse({
                    rating: 4,
                    comment: longComment,
                });
                expect(result.success).toBe(true);
            });

            it('should reject empty comment', () => {
                const result = reviewFormSchema.safeParse({
                    rating: 4,
                    comment: '',
                });
                expect(result.success).toBe(false);
            });

            it('should reject missing comment', () => {
                const result = reviewFormSchema.safeParse({
                    rating: 4,
                });
                expect(result.success).toBe(false);
            });

            it('should trim whitespace from comment', () => {
                const result = reviewFormSchema.safeParse({
                    rating: 4,
                    comment: '   Bu ürün çok güzel   ',
                });
                expect(result.success).toBe(true);
                if (result.success) {
                    expect(result.data.comment).toBe('Bu ürün çok güzel');
                }
            });

            it('should handle Turkish characters correctly', () => {
                const result = reviewFormSchema.safeParse({
                    rating: 5,
                    comment: 'Türkçe karakterler: ğüşıöç ĞÜŞIÖÇ',
                });
                expect(result.success).toBe(true);
            });
        });

        describe('Combined Validation', () => {
            it('should validate both fields together', () => {
                const result = reviewFormSchema.safeParse({
                    rating: 3,
                    comment: 'Ortalama bir ürün, idare eder.',
                });
                expect(result.success).toBe(true);
                if (result.success) {
                    expect(result.data.rating).toBe(3);
                    expect(result.data.comment).toBe(
                        'Ortalama bir ürün, idare eder.'
                    );
                }
            });

            it('should fail if both fields are invalid', () => {
                const result = reviewFormSchema.safeParse({
                    rating: 0,
                    comment: 'Kısa',
                });
                expect(result.success).toBe(false);
            });

            it('should reject completely empty object', () => {
                const result = reviewFormSchema.safeParse({});
                expect(result.success).toBe(false);
            });

            it('should reject null values', () => {
                const result = reviewFormSchema.safeParse({
                    rating: null,
                    comment: null,
                });
                expect(result.success).toBe(false);
            });
        });

        describe('Real World Scenarios', () => {
            it('should accept typical positive review', () => {
                const result = reviewFormSchema.safeParse({
                    rating: 5,
                    comment:
                        'Ürün beklentilerimi karşıladı. Hızlı kargo, kaliteli ambalaj. Teşekkürler!',
                });
                expect(result.success).toBe(true);
            });

            it('should accept typical negative review', () => {
                const result = reviewFormSchema.safeParse({
                    rating: 2,
                    comment:
                        'Maalesef ürün açıklamada belirtildiği gibi değildi. Kalite beklentimin altında.',
                });
                expect(result.success).toBe(true);
            });

            it('should accept neutral review', () => {
                const result = reviewFormSchema.safeParse({
                    rating: 3,
                    comment:
                        'Fiyatına göre idare eder. Çok iyi değil ama kötü de değil.',
                });
                expect(result.success).toBe(true);
            });

            it('should handle reviews with numbers and special characters', () => {
                const result = reviewFormSchema.safeParse({
                    rating: 4,
                    comment:
                        'Ürün 10 gün sonra geldi. Fiyat/performans 8/10. %90 memnunum!',
                });
                expect(result.success).toBe(true);
            });
        });
    });
});
