'use client';

import { useShop } from '../context/ShopContext';
import Link from 'next/link';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useShop();

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
        <Link href="/shop" className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="lg:w-2/3">
            <AnimatePresence>
                {cart.map((item) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center gap-4 border-b py-6"
                    >
                        <img src={item.thumbnail} alt={item.title} className="w-24 h-24 object-cover rounded-lg bg-gray-100" />
                        <div className="flex-grow">
                            <h3 className="font-bold text-lg">{item.title}</h3>
                            <p className="text-gray-500 text-sm">${item.price}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={() => updateQuantity(item.id, -1)}
                                className="p-1 rounded-full hover:bg-gray-100 bg-white shadow-sm border border-gray-200"
                                disabled={item.quantity <= 1}
                            >
                                <Minus size={16} className="text-gray-700" />
                            </button>
                            <span className="font-bold w-6 text-center text-gray-900 bg-white/50 rounded px-1">{item.quantity}</span>
                            <button 
                                onClick={() => updateQuantity(item.id, 1)}
                                className="p-1 rounded-full hover:bg-gray-100 bg-white shadow-sm border border-gray-200"
                            >
                                <Plus size={16} className="text-gray-700" />
                            </button>
                        </div>
                         <div className="font-bold text-lg w-24 text-right text-gray-900">
                            ${(item.price * item.quantity).toFixed(2)}
                        </div>
                        <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700 p-2"
                        >
                            <Trash2 size={20} />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
            <div className="mt-6 flex justify-between">
                <button onClick={clearCart} className="text-red-500 hover:underline">Clear Cart</button>
            </div>
        </div>

        <div className="lg:w-1/3">
            <div className="bg-gray-50 p-6 rounded-xl shadow-lg sticky top-24">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                <div className="flex justify-between mb-2 text-gray-600">
                    <span>Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                </div>
                 <div className="flex justify-between mb-4 text-gray-600">
                    <span>Shipping</span>
                    <span>Free</span>
                </div>
                <div className="border-t pt-4 flex justify-between font-bold text-xl mb-6">
                    <span>Total</span>
                    <span>${cartTotal.toFixed(2)}</span>
                </div>
                <Link href="/checkout" className="w-full bg-black text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition">
                    Proceed to Checkout
                    <ArrowRight size={18} />
                </Link>
            </div>
        </div>
      </div>
    </div>
  );
}
