'use client';

import { useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { ShoppingCart, Heart, Eye, Star } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import Link from 'next/link';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart, toggleWishlist, wishlist } = useShop();
  const isWishlisted = wishlist.some((item) => item.id === product.id);

  // 3D Tilt Values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, rotate: -45, y: 100, z: -500 }}
      whileInView={{ opacity: 1, scale: 1, rotate: 0, y: 0, z: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      transition={{ 
        duration: 1.2, 
        ease: [0.16, 1, 0.3, 1],
        opacity: { duration: 0.8 }
      }}
      className="glass-card rounded-[40px] overflow-hidden group relative shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:shadow-[0_80px_150px_-30px_rgba(59,130,246,0.3)] transition-all duration-700 border border-white/10"
    >
      {/* 3D Depth Layers */}
      <div 
        style={{ transform: "translateZ(100px)", transformStyle: "preserve-3d" }}
        className="relative aspect-[4/5] overflow-hidden bg-gray-950 m-5 rounded-[32px] shine-effect"
      >
        <Link href={`/products/${product.id}`}>
            <motion.img
            src={product.thumbnail}
            alt={product.title}
            style={{ transform: "translateZ(50px)" }}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000 ease-in-out filter drop-shadow-2xl brightness-75 group-hover:brightness-100"
            />
        </Link>
        
        {/* Floating Badges */}
        <div style={{ transform: "translateZ(150px)" }} className="absolute top-6 left-6 flex flex-col gap-2 z-10">
          {product.discountPercentage > 15 && (
              <div className="bg-red-600/90 backdrop-blur-md text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-[0_10px_20px_rgba(220,38,38,0.3)] border border-red-500/30">
                  SALE
              </div>
          )}
          {product.rating > 4.5 && (
              <div className="bg-blue-600/90 backdrop-blur-md text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-[0_10px_20px_rgba(37,99,235,0.3)] border border-blue-500/30">
                  HOT
              </div>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ transform: "translateZ(180px)" }} className="absolute顶-6 right-6 flex flex-col gap-3 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 z-10">
          <motion.button
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => toggleWishlist(product, e)}
            className={`p-4 rounded-full shadow-2xl backdrop-blur-3xl transition-all border border-white/10 ${isWishlisted ? 'bg-red-500 text-white' : 'bg-black/40 text-white hover:bg-white hover:text-black'}`}
          >
            <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
          </motion.button>
           <Link href={`/products/${product.id}`}>
            <motion.div
                whileHover={{ scale: 1.1, rotate: -5 }}
                whileTap={{ scale: 0.9 }}
                className="p-4 bg-black/40 backdrop-blur-3xl text-white rounded-full shadow-2xl hover:bg-white hover:text-black transition-all border border-white/10"
            >
                <Eye size={20} />
            </motion.div>
          </Link>
        </div>

        {/* Quick Add Overlay */}
        <div style={{ transform: "translateZ(140px)" }} className="absolute inset-x-0 bottom-0 p-8 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-gradient-to-t from-black via-black/50 to-transparent z-10">
          <motion.button
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => addToCart(product)}
            className="glow-btn w-full bg-white text-black py-5 rounded-3xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
            style={{ '--primary': '#3b82f6' }}
          >
            <ShoppingCart size={18} /> Initiate Order
          </motion.button>
        </div>
      </div>

      {/* Info Section */}
      <div style={{ transform: "translateZ(80px)" }} className="p-8 pt-2">
        <div className="flex justify-between items-start mb-4">
           <Link href={`/products/${product.id}`} className="flex-grow">
              <h3 className="text-xl font-black text-white leading-tight group-hover:text-blue-500 transition-colors uppercase tracking-tighter truncate">
                {product.title}
              </h3>
           </Link>
           <div className="flex items-center bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
              <Star size={14} className="text-yellow-400 fill-yellow-400" />
              <span className="text-[10px] font-black text-white ml-1.5">{product.rating}</span>
           </div>
        </div>
        
        <div className="flex items-center justify-between">
            <div className="flex flex-col">
                <span className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{product.category}</span>
                <span className="text-3xl font-black text-white tracking-tighter">${product.price}</span>
            </div>
            {product.discountPercentage > 0 && (
                <div className="bg-white/5 border border-white/10 px-3 py-1 rounded-lg">
                    <span className="text-[10px] text-gray-500 line-through font-bold">
                        ${(product.price / (1 - product.discountPercentage / 100)).toFixed(0)}
                    </span>
                </div>
            )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
