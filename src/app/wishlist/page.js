'use client';

import { useShop } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';
import Link from 'next/link';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Wishlist() {
  const { wishlist } = useShop();

  return (
    <div className="bg-white min-h-screen">
      {/* Header Section */}
      <div className="bg-gray-50 border-b border-gray-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-red-50 rounded-full mb-6 text-red-500 shadow-xl shadow-red-100"
          >
            <Heart size={36} fill="currentColor" />
          </motion.div>
          <h1 className="text-5xl font-black text-gray-900 mb-4 uppercase tracking-tighter">My Wishlist</h1>
          <p className="text-gray-500 font-medium uppercase tracking-widest text-sm">
            {wishlist.length} {wishlist.length === 1 ? 'Item' : 'Items'} Saved for later
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {wishlist.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full mb-8 shadow-sm">
               <ShoppingBag size={40} className="text-gray-200" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-4 uppercase tracking-tighter">Your Wishlist is Empty</h2>
            <p className="text-gray-500 mb-10 max-w-md mx-auto leading-relaxed">
              Looks like you haven't added any favorites yet. Explore our curated collections and save items you love.
            </p>
            <Link 
              href="/shop" 
              className="inline-flex items-center gap-3 bg-gray-900 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-gray-200"
            >
              Start Shopping <ArrowRight size={20} />
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
