'use client';

import { useShop } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';
import Link from 'next/link';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Wishlist() {
  const { wishlist } = useShop();

  return (
    <div className="bg-black min-h-screen text-white">
      {/* Header Section */}
      <div className="bg-white/5 border-b border-white/5 py-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-600/5 to-transparent opacity-50"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="inline-flex items-center justify-center w-24 h-24 bg-red-500/10 border border-red-500/20 rounded-full mb-8 text-red-500 shadow-2xl shadow-red-500/10 backdrop-blur-3xl"
          >
            <Heart size={40} fill="currentColor" />
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase tracking-tighter">My Wishlist</h1>
          <p className="text-gray-500 font-black uppercase tracking-[0.3em] text-[10px]">
            {wishlist.length} {wishlist.length === 1 ? 'Item' : 'Items'} ARCHIVED IN YOUR SELECTION
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-24">
        {wishlist.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-32 bg-white/5 rounded-[60px] border border-white/10 shadow-3xl backdrop-blur-3xl"
          >
            <div className="inline-flex items-center justify-center w-32 h-32 bg-white/5 border border-white/10 rounded-full mb-10 shadow-inner">
              <ShoppingBag size={48} className="text-gray-700" />
            </div>
            <h2 className="text-4xl font-black text-white mb-6 uppercase tracking-tighter">Your Wishlist is Empty</h2>
            <p className="text-gray-500 mb-12 max-w-md mx-auto leading-relaxed font-medium">
              Your personal gallery awaits. Explore our curated ecosystems and archive the pieces that resonate with your style.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-4 bg-white text-black px-12 py-5 rounded-full font-black uppercase tracking-[0.2em] text-xs hover:bg-blue-600 hover:text-white transition-all shadow-2xl hover:scale-105 active:scale-95"
            >
              Start Shopping <ArrowRight size={18} />
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {wishlist.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>

  );
}
