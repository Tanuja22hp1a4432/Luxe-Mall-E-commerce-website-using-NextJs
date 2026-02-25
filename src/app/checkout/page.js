'use client';

import { useShop } from '../context/ShopContext';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { CreditCard, Wallet, Landmark, Truck, ShieldCheck, ShoppingBag, Loader2, ArrowRight } from 'lucide-react';

export default function Checkout() {
    const { cart, cartTotal, placeOrder } = useShop();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        city: '',
        state: '',
        zip: ''
    });

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate payment processing
        setTimeout(() => {
            setLoading(false);
            const order = placeOrder({ ...formData, paymentMethod });
            toast.success(`Order ${order.id} placed successfully! 🎉`);
            router.push('/profile');
        }, 2000);
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 pt-32">
                <div className="bg-white p-12 rounded-[40px] shadow-2xl text-center max-w-md w-full border border-gray-100">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                        <ShoppingBag size={40} />
                    </div>
                    <h2 className="text-2xl font-black mb-4 uppercase tracking-tighter text-gray-900">Your cart is empty</h2>
                    <p className="text-gray-500 mb-8 font-medium">Add some amazing products to your cart before checking out.</p>
                    <button onClick={() => router.push('/shop')} className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl">
                        Start Shopping
                    </button>
                </div>
            </div>
        );
    }

    const paymentOptions = [
        { id: 'card', name: 'Credit / Debit Card', icon: CreditCard },
        { id: 'paypal', name: 'PayPal', icon: Wallet },
        { id: 'stripe', name: 'Stripe', icon: ShieldCheck },
        { id: 'upi', name: 'UPI / NetBanking', icon: Landmark },
        { id: 'cod', name: 'Cash on Delivery', icon: Truck }
    ];

    return (
        <div className="bg-black min-h-screen text-white pt-32 pb-20">
            <div className="container mx-auto px-4">
                <header className="text-center mb-16 px-4">
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase tracking-tighter">Secure Checkout</h1>
                    <p className="text-gray-500 font-black uppercase tracking-[0.4em] text-[10px]">Transmission secured via 256-bit encryption protocol</p>
                </header>

                <div className="flex flex-col lg:flex-row gap-12 max-w-7xl mx-auto">
                    {/* Billing Form */}
                    <div className="lg:w-2/3 space-y-10 px-4">
                        <div className="bg-white/5 p-10 md:p-16 rounded-[60px] shadow-3xl border border-white/10 backdrop-blur-3xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px]"></div>
                            <div className="flex items-center gap-6 mb-12">
                                <div className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center font-black text-xl shadow-2xl">1</div>
                                <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Shipping Protocol</h2>
                            </div>

                            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8 relative z-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 ml-4">First Identity</label>
                                        <input name="firstName" type="text" required value={formData.firstName} onChange={handleChange} className="w-full bg-white/5 border border-white/5 rounded-3xl px-8 py-5 focus:ring-2 focus:ring-blue-600 outline-none font-black text-white transition-all uppercase tracking-widest text-xs" placeholder="First name" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 ml-4">Last Identity</label>
                                        <input name="lastName" type="text" required value={formData.lastName} onChange={handleChange} className="w-full bg-white/5 border border-white/5 rounded-3xl px-8 py-5 focus:ring-2 focus:ring-blue-600 outline-none font-black text-white transition-all uppercase tracking-widest text-xs" placeholder="Last name" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 ml-4">Digital Connection</label>
                                    <input name="email" type="email" required value={formData.email} onChange={handleChange} className="w-full bg-white/5 border border-white/5 rounded-3xl px-8 py-5 focus:ring-2 focus:ring-blue-600 outline-none font-black text-white transition-all uppercase tracking-widest text-xs" placeholder="you@network.com" />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 ml-4">Delivery Coordinates</label>
                                    <input name="address" type="text" required value={formData.address} onChange={handleChange} className="w-full bg-white/5 border border-white/5 rounded-3xl px-8 py-5 focus:ring-2 focus:ring-blue-600 outline-none font-black text-white transition-all uppercase tracking-widest text-xs" placeholder="Street address, unit, floor" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 ml-4">City Hub</label>
                                        <input name="city" type="text" required value={formData.city} onChange={handleChange} className="w-full bg-white/5 border border-white/5 rounded-3xl px-8 py-5 focus:ring-2 focus:ring-blue-600 outline-none font-black text-white transition-all uppercase tracking-widest text-xs" placeholder="City" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 ml-4">State Sector</label>
                                        <input name="state" type="text" required value={formData.state} onChange={handleChange} className="w-full bg-white/5 border border-white/5 rounded-3xl px-8 py-5 focus:ring-2 focus:ring-blue-600 outline-none font-black text-white transition-all uppercase tracking-widest text-xs" placeholder="State" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 ml-4">Postal Index</label>
                                        <input name="zip" type="text" required value={formData.zip} onChange={handleChange} className="w-full bg-white/5 border border-white/5 rounded-3xl px-8 py-5 focus:ring-2 focus:ring-blue-600 outline-none font-black text-white transition-all uppercase tracking-widest text-xs" placeholder="000000" />
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="bg-white/5 p-10 md:p-16 rounded-[60px] shadow-3xl border border-white/10 backdrop-blur-3xl relative overflow-hidden">
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-[100px]"></div>
                            <div className="flex items-center gap-6 mb-12">
                                <div className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center font-black text-xl shadow-2xl">2</div>
                                <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Payment Method</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                                {paymentOptions.map((option) => (
                                    <button
                                        key={option.id}
                                        onClick={() => setPaymentMethod(option.id)}
                                        className={`flex items-center justify-between p-6 rounded-3xl border-2 transition-all ${paymentMethod === option.id ? 'border-blue-600 bg-blue-600/10 shadow-2xl shadow-blue-500/20 scale-[1.02]' : 'border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10'}`}
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className={`p-3 rounded-2xl ${paymentMethod === option.id ? 'bg-blue-600 text-white' : 'bg-black text-gray-500 border border-white/5'}`}>
                                                <option.icon size={24} />
                                            </div>
                                            <span className={`font-black text-xs uppercase tracking-[0.2em] ${paymentMethod === option.id ? 'text-white' : 'text-gray-500'}`}>
                                                {option.name}
                                            </span>
                                        </div>
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${paymentMethod === option.id ? 'border-blue-600' : 'border-white/10'}`}>
                                            {paymentMethod === option.id && <div className="w-3 h-3 bg-blue-600 rounded-full" />}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:w-1/3 px-4">
                        <div className="bg-white/5 p-10 rounded-[60px] shadow-3xl border border-white/10 backdrop-blur-3xl sticky top-32 overflow-hidden">
                            <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
                            <h2 className="text-3xl font-black mb-10 uppercase tracking-tighter text-white">Manifest</h2>
                            <div className="space-y-8 max-h-[400px] overflow-y-auto mb-10 pr-4 custom-scrollbar-dark text-left">
                                {cart.map((item) => (
                                    <div key={item.id} className="flex gap-6 group">
                                        <div className="relative w-28 h-28 bg-white rounded-3xl overflow-hidden shadow-2xl flex-shrink-0 p-2 border border-white/10">
                                            <img src={item.thumbnail} alt={item.title} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" />
                                            <div className="absolute top-2 right-2 bg-black text-white text-[9px] font-black px-2.5 py-1 rounded-full border border-white/10 shadow-lg">
                                                X{item.quantity}
                                            </div>
                                        </div>
                                        <div className="flex flex-col justify-center">
                                            <p className="font-black text-white uppercase tracking-tighter text-md line-clamp-1 mb-1">{item.title}</p>
                                            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-3">{item.category}</p>
                                            <p className="font-black text-blue-500 text-xl">${(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-5 border-t border-white/5 pt-10">
                                <div className="flex justify-between text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">
                                    <span>Baseline Total</span>
                                    <span className="text-white">${cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">
                                    <span>Logistics</span>
                                    <span className="text-green-500">EXEMPTED</span>
                                </div>
                                <div className="flex justify-between items-end pt-6 border-t border-dashed border-white/10">
                                    <span className="text-xl font-black text-white uppercase tracking-tighter">Net Total</span>
                                    <span className="text-4xl font-black text-blue-500 tracking-tighter">${cartTotal.toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                form="checkout-form"
                                type="submit"
                                disabled={loading}
                                className="w-full bg-white text-black py-6 rounded-[32px] font-black uppercase tracking-[0.3em] text-xs mt-12 hover:bg-blue-600 hover:text-white transition-all shadow-3xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-4 group"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={24} className="animate-spin text-blue-600" />
                                        Authorizing...
                                    </>
                                ) : (
                                    <>
                                        Authorize Order <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" />
                                    </>
                                )}
                            </button>
                            <div className="text-center text-[9px] font-black text-gray-600 uppercase tracking-[0.4em] mt-8 flex items-center justify-center gap-3">
                                <ShieldCheck size={16} className="text-green-600" /> BIOMETRICALLY SECURE | AES-256
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}
