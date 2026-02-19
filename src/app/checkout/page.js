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
    <div className="bg-gray-50 min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4">
        <header className="text-center mb-16">
            <h1 className="text-5xl font-black text-gray-900 mb-4 uppercase tracking-tighter">Secure Checkout</h1>
            <p className="text-gray-500 font-medium uppercase tracking-[0.3em] text-xs">Complete your order details below</p>
        </header>
        
        <div className="flex flex-col lg:flex-row gap-12 max-w-6xl mx-auto">
          {/* Billing Form */}
          <div className="lg:w-2/3 space-y-8">
            <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-2xl shadow-gray-200 border border-gray-100">
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-black">1</div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter text-gray-900">Shipping Information</h2>
                </div>
                
                <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">First Name</label>
                            <input name="firstName" type="text" required value={formData.firstName} onChange={handleChange} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-blue-600 outline-none font-bold text-gray-900 transition-all" placeholder="Enter first name" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Last Name</label>
                            <input name="lastName" type="text" required value={formData.lastName} onChange={handleChange} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-blue-600 outline-none font-bold text-gray-900 transition-all" placeholder="Enter last name" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
                        <input name="email" type="email" required value={formData.email} onChange={handleChange} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-blue-600 outline-none font-bold text-gray-900 transition-all" placeholder="you@example.com" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Delivery Address</label>
                        <input name="address" type="text" required value={formData.address} onChange={handleChange} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-blue-600 outline-none font-bold text-gray-900 transition-all" placeholder="Street address, apartment, suite" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">City</label>
                            <input name="city" type="text" required value={formData.city} onChange={handleChange} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-blue-600 outline-none font-bold text-gray-900 transition-all" placeholder="City" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">State / Province</label>
                            <input name="state" type="text" required value={formData.state} onChange={handleChange} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-blue-600 outline-none font-bold text-gray-900 transition-all" placeholder="State" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">ZIP / Postal</label>
                            <input name="zip" type="text" required value={formData.zip} onChange={handleChange} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-blue-600 outline-none font-bold text-gray-900 transition-all" placeholder="000000" />
                        </div>
                    </div>
                </form>
            </div>

            <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-2xl shadow-gray-200 border border-gray-100">
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-black">2</div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter text-gray-900">Payment Method</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {paymentOptions.map((option) => (
                        <button
                            key={option.id}
                            onClick={() => setPaymentMethod(option.id)}
                            className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${paymentMethod === option.id ? 'border-blue-600 bg-blue-50/50 shadow-lg shadow-blue-100/50' : 'border-gray-50 bg-gray-50/50 hover:bg-gray-100 hover:border-gray-200'}`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-lg ${paymentMethod === option.id ? 'bg-blue-600 text-white' : 'bg-white text-gray-400'}`}>
                                    <option.icon size={20} />
                                </div>
                                <span className={`font-black text-sm uppercase tracking-widest ${paymentMethod === option.id ? 'text-gray-900' : 'text-gray-400'}`}>
                                    {option.name}
                                </span>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === option.id ? 'border-blue-600' : 'border-gray-200'}`}>
                                {paymentMethod === option.id && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
                            </div>
                        </button>
                    ))}
                </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
             <div className="bg-white p-8 rounded-[40px] shadow-2xl shadow-gray-200 border border-gray-100 sticky top-32">
                <h2 className="text-2xl font-black mb-8 uppercase tracking-tighter text-gray-900">Order Summary</h2>
                <div className="space-y-6 max-h-[400px] overflow-y-auto mb-8 pr-4 custom-scrollbar text-left">
                    {cart.map((item) => (
                         <div key={item.id} className="flex gap-4 group">
                            <div className="relative w-24 h-24 bg-gray-50 rounded-2xl overflow-hidden shadow-sm flex-shrink-0">
                                <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                <div className="absolute top-1 right-1 bg-gray-900 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                                    x{item.quantity}
                                </div>
                            </div>
                            <div className="flex flex-col justify-center">
                                <p className="font-black text-gray-900 uppercase tracking-tighter text-sm line-clamp-1">{item.title}</p>
                                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">{item.category}</p>
                                <p className="font-black text-blue-600 mt-2">${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                         </div>
                    ))}
                </div>
                
                <div className="space-y-4 border-t border-gray-100 pt-8">
                    <div className="flex justify-between text-sm font-bold text-gray-400 uppercase tracking-widest">
                        <span>Subtotal</span>
                        <span className="text-gray-900">${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-gray-400 uppercase tracking-widest">
                        <span>Shipping</span>
                        <span className="text-green-600">FREE</span>
                    </div>
                    <div className="flex justify-between items-end pt-4 border-t-2 border-dashed border-gray-100">
                        <span className="text-xl font-black text-gray-900 uppercase tracking-tighter">Grand Total</span>
                        <span className="text-3xl font-black text-blue-600">${cartTotal.toFixed(2)}</span>
                    </div>
                </div>

                <button 
                    form="checkout-form"
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm mt-10 hover:bg-black transition-all shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                    {loading ? (
                        <>
                            <Loader2 size={20} className="animate-spin" />
                            Processing...
                        </>
                    ) : (
                        <>
                            Complete Purchase <ArrowRight size={20} />
                        </>
                    )}
                </button>
                <div className="text-center text-[10px] font-black text-gray-400 uppercase tracking-widest mt-6 flex items-center justify-center gap-2">
                    <ShieldCheck size={14} className="text-green-500" /> SSL SECURE | 256-BIT ENCRYPTION
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
