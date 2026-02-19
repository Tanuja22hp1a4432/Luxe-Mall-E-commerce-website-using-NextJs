'use client';

import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Eye, Star } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import Link from 'next/link';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart, toggleWishlist, wishlist } = useShop();
  const isWishlisted = wishlist.some((item) => item.id === product.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-white rounded-[32px] overflow-hidden group relative shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
        <Link href={`/products/${product.id}`}>
            <img
            src={product.thumbnail}
            alt={product.title}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
            />
        </Link>
        
        {/* Floating Badges */}
        <div className="absolute top-5 left-5 flex flex-col gap-2 z-10">
          {product.discountPercentage > 15 && (
              <div className="bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                  SALE
              </div>
          )}
          {product.rating > 4.5 && (
              <div className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                  HOT
              </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-5 right-5 flex flex-col gap-3 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 z-10">
          <button
            onClick={() => toggleWishlist(product)}
            className={`p-3 rounded-full shadow-xl backdrop-blur-md transition-all ${isWishlisted ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-900 hover:bg-white'}`}
          >
            <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
          </button>
           <Link href={`/products/${product.id}`} className="p-3 bg-white/80 backdrop-blur-md text-gray-900 rounded-full shadow-xl hover:bg-white transition-all">
            <Eye size={20} />
          </Link>
        </div>

        {/* Quick Add Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/60 to-transparent z-10">
          <button
            onClick={() => addToCart(product)}
            className="w-full bg-white text-gray-900 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-colors flex items-center justify-center gap-2 shadow-xl"
          >
            <ShoppingCart size={18} /> Quick Add
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
           <Link href={`/products/${product.id}`} className="flex-grow">
              <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors uppercase tracking-tight truncate">
                {product.title}
              </h3>
           </Link>
           <div className="flex items-center bg-gray-50 px-2 py-1 rounded-lg">
              <Star size={14} className="text-yellow-400 fill-yellow-400" />
              <span className="text-[10px] font-black text-gray-700 ml-1">{product.rating}</span>
           </div>
        </div>
        
        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-4">{product.brand || product.category}</p>
        
        <div className="flex items-center gap-3">
          <span className="text-2xl font-black text-gray-900">${product.price}</span>
          {product.discountPercentage > 0 && (
              <span className="text-sm text-gray-400 line-through font-medium">
                  ${(product.price / (1 - product.discountPercentage / 100)).toFixed(0)}
              </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
