import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import InteractiveCreditCard from './InteractiveCreditCard';

const PaymentStep = ({ onNext, onPrevious, bookingData, onDataUpdate, error, setError, isLoading, setLoading }) => {
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [cardDetails, setCardDetails] = useState({
        number: '',
        name: '',
        expiry: '',
        cvc: '',
        focus: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCardDetails(prev => ({ ...prev, [name]: value }));
        onDataUpdate({ payment: { ...bookingData.payment, [name]: value } });
    };

    const handleInputFocus = (e) => {
        setCardDetails(prev => ({ ...prev, focus: e.target.name }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onNext({ payment: { method: paymentMethod, ...cardDetails } });
    };

    return (
        <div className="space-y-12">
            <div className="text-center mb-10">
                <h2 className="text-2xl font-bold text-foreground mb-2">Secure Checkout</h2>
                <p className="text-muted-foreground text-sm">Complete your reservation securely.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Card Visual */}
                <div className="flex flex-col items-center justify-center order-2 lg:order-1">
                    <div className="scale-90 lg:scale-100 transform transition-transform">
                        <InteractiveCreditCard
                            number={cardDetails.number}
                            name={cardDetails.name}
                            expiry={cardDetails.expiry}
                            cvc={cardDetails.cvc}
                            focused={cardDetails.focus}
                        />
                    </div>
                    <div className="mt-8 text-center text-xs text-muted-foreground flex items-center gap-2 uppercase tracking-widest">
                        <Icon name="Lock" size={12} />
                        256-Bit SSL Encrypted
                    </div>
                </div>

                {/* Payment Form */}
                <div className="space-y-8 order-1 lg:order-2">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="group">
                            <label className="block text-xs font-semibold text-foreground mb-1.5">Card Number</label>
                            <div className="relative">
                                <input
                                    type="tel"
                                    name="number"
                                    placeholder="0000 0000 0000 0000"
                                    value={cardDetails.number}
                                    onChange={handleInputChange}
                                    onFocus={handleInputFocus}
                                    maxLength="19"
                                    className="w-full h-11 px-3 bg-background border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all font-mono text-sm text-foreground placeholder-muted-foreground/50"
                                    required
                                />
                                <Icon name="CreditCard" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                            </div>
                        </div>

                        <div className="group">
                            <label className="block text-xs font-semibold text-foreground mb-1.5">Cardholder Name</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="JOHN DOE"
                                    value={cardDetails.name}
                                    onChange={handleInputChange}
                                    onFocus={handleInputFocus}
                                    className="w-full h-11 px-3 bg-background border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all text-sm font-medium text-foreground uppercase placeholder-muted-foreground/50"
                                    required
                                />
                                <Icon name="User" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="group">
                                <label className="block text-xs font-semibold text-foreground mb-1.5">Expiry Date</label>
                                <div className="relative">
                                    <input
                                        type="tel"
                                        name="expiry"
                                        placeholder="MM/YY"
                                        value={cardDetails.expiry}
                                        onChange={handleInputChange}
                                        onFocus={handleInputFocus}
                                        maxLength="5"
                                        className="w-full h-11 px-3 bg-background border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all font-mono text-sm text-foreground placeholder-muted-foreground/50"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="group">
                                <label className="block text-xs font-semibold text-foreground mb-1.5">CVC</label>
                                <div className="relative">
                                    <input
                                        type="tel"
                                        name="cvc"
                                        placeholder="123"
                                        value={cardDetails.cvc}
                                        onChange={handleInputChange}
                                        onFocus={handleInputFocus}
                                        maxLength="3"
                                        className="w-full h-11 px-3 bg-background border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all font-mono text-sm text-foreground placeholder-muted-foreground/50"
                                        required
                                    />
                                    <Icon name="Shield" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <div className="flex justify-between pt-8 border-t border-border">
                <button
                    onClick={onPrevious}
                    className="px-6 py-2.5 rounded-lg text-muted-foreground font-medium hover:bg-secondary hover:text-foreground transition-colors text-sm"
                    disabled={isLoading}
                >
                    Back
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                >
                    {isLoading ? (
                        <>
                            <Icon name="Loader2" className="animate-spin" size={16} />
                            Processing...
                        </>
                    ) : (
                        <>
                            Confirm & Pay
                            <Icon name="ArrowRight" size={16} />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default PaymentStep;