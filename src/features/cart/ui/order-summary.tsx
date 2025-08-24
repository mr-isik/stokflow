/**
 * Cart Order Summary Component
 * Reusable order summary for cart page and checkout
 */

import {
    Card,
    CardHeader,
    CardBody,
    Button,
    Divider,
    Input,
} from '@heroui/react';
import { IoLockClosedOutline, IoCardOutline } from 'react-icons/io5';
import { Cart } from '../model';
import { formatPrice, calculateCartTotals } from '../lib/utils';

interface CartOrderSummaryProps {
    cart: Cart;
    couponCode?: string;
    onCouponCodeChange?: (code: string) => void;
    onCheckout?: () => void;
    showCouponInput?: boolean;
    showPaymentMethods?: boolean;
    showSecurityInfo?: boolean;
    className?: string;
}

export const CartOrderSummary = ({
    cart,
    couponCode = '',
    onCouponCodeChange,
    onCheckout,
    showCouponInput = true,
    showPaymentMethods = true,
    showSecurityInfo = true,
    className = '',
}: CartOrderSummaryProps) => {
    const totals = calculateCartTotals(cart.items);

    return (
        <div className={`xl:col-span-1 ${className}`}>
            <Card className="shadow-sm sticky top-8">
                <CardHeader>
                    <h2 className="text-xl font-bold text-foreground">
                        Sipariş Özeti
                    </h2>
                </CardHeader>
                <CardBody className="space-y-4">
                    {/* Coupon Code */}
                    {showCouponInput && (
                        <>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">
                                    İndirim Kodu
                                </label>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Kupon kodunu giriniz"
                                        value={couponCode}
                                        onValueChange={onCouponCodeChange}
                                        size="sm"
                                    />
                                    <Button
                                        size="sm"
                                        variant="bordered"
                                        isDisabled={!couponCode.trim()}
                                    >
                                        Uygula
                                    </Button>
                                </div>
                            </div>
                            <Divider />
                        </>
                    )}

                    {/* Price Breakdown */}
                    <div className="space-y-3">
                        <div className="flex justify-between text-default-600">
                            <span>Ara Toplam</span>
                            <span>{formatPrice(totals.subtotal)}</span>
                        </div>

                        <div className="flex justify-between text-default-600">
                            <span>Kargo</span>
                            <span
                                className={
                                    totals.shipping === 0 ? 'text-success' : ''
                                }
                            >
                                {totals.shipping === 0
                                    ? 'Ücretsiz'
                                    : formatPrice(totals.shipping)}
                            </span>
                        </div>

                        {totals.shipping > 0 && (
                            <p className="text-xs text-default-500">
                                {formatPrice(500 - totals.subtotal)} daha
                                alışveriş yapın,
                                <span className="text-success font-medium">
                                    {' '}
                                    ücretsiz kargo
                                </span>{' '}
                                kazanın!
                            </p>
                        )}

                        <div className="flex justify-between text-default-600">
                            <span>KDV (%18)</span>
                            <span>{formatPrice(totals.tax)}</span>
                        </div>

                        <Divider />

                        <div className="flex justify-between text-lg font-bold text-foreground">
                            <span>Toplam</span>
                            <span>{formatPrice(totals.total)}</span>
                        </div>
                    </div>

                    {/* Checkout Button */}
                    {onCheckout && (
                        <Button
                            color="primary"
                            size="lg"
                            className="w-full"
                            startContent={
                                <IoLockClosedOutline className="w-4 h-4" />
                            }
                            onPress={onCheckout}
                        >
                            Güvenli Ödeme
                        </Button>
                    )}

                    {/* Payment Methods */}
                    {showPaymentMethods && (
                        <div className="text-center space-y-2">
                            <p className="text-xs text-default-500">
                                Kabul edilen ödeme yöntemleri
                            </p>
                            <div className="flex justify-center items-center gap-2 opacity-60">
                                <IoCardOutline className="w-6 h-6" />
                                <span className="text-xs">
                                    Visa • Mastercard • American Express
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Security Info */}
                    {showSecurityInfo && (
                        <div className="bg-success-50 p-3 rounded-lg">
                            <div className="flex items-center gap-2 text-success">
                                <IoLockClosedOutline className="w-4 h-4" />
                                <span className="text-sm font-medium">
                                    Güvenli Alışveriş
                                </span>
                            </div>
                            <p className="text-xs text-success-600 mt-1">
                                256-bit SSL şifreleme ile korunur
                            </p>
                        </div>
                    )}
                </CardBody>
            </Card>
        </div>
    );
};
