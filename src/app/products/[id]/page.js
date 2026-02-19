'use client';

import { use, useState, useEffect } from 'react';
import { fetchProductById, fetchProducts } from '../../utils/api';
import { useShop } from '../../context/ShopContext';
import { ShoppingCart, Heart, Shield, Truck, RotateCcw, Star, ChevronRight, MessageSquare, Sparkles } from 'lucide-react';
import ProductCard from '../../components/ProductCard';
import { motion } from 'framer-motion';
import Link from 'next/link';
import ReviewSystem from '../../components/ReviewSystem';
import VirtualTryOn from '../../components/VirtualTryOn';

export default function ProductDetail({ params }) {
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [activeImage, setActiveImage] = useState('');
  const { addToCart, toggleWishlist, wishlist } = useShop();
  const [quantity, setQuantity] = useState(1);
  const [virtualTryOnOpen, setVirtualTryOnOpen] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
        if (id) {
            const data = await fetchProductById(id);
            setProduct(data);
            setActiveImage(data.thumbnail);

            // Mock recommendations by fetching products in same category
            const allProducts = await fetchProducts(50);
            const related = allProducts.products
              .filter(p => p.category === data.category && p.id !== data.id)
              .slice(0, 4);
            setRelatedProducts(related);
        }
    };
    loadProduct();
  }, [id]);

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center">
       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  const isWishlisted = wishlist.some(item => item.id === product.id);

  return (
    <div className="bg-white">
      {/* Breadcrumbs */}
      <div className="bg-gray-50 border-b border-gray-100 py-4">
        <div className="container mx-auto px-4 flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
           <Link href="/" className="hover:text-blue-600">Home</Link>
           <ChevronRight size={12} />
           <Link href="/shop" className="hover:text-blue-600">Shop</Link>
           <ChevronRight size={12} />
           <span className="text-gray-900 truncate">{product.title}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Image Gallery */}
          <div className="lg:w-1/2">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative aspect-square bg-gray-50 rounded-[40px] overflow-hidden mb-6 flex items-center justify-center p-8 group"
            >
                <img src={activeImage || product.thumbnail} alt={product.title} className="max-h-full max-w-full object-contain transition-transform duration-700 group-hover:scale-110" />
                {product.discountPercentage > 15 && (
                  <div className="absolute top-8 left-8 bg-red-600 text-white font-black px-4 py-2 rounded-full shadow-xl">
                    SALE -{Math.round(product.discountPercentage)}%
                  </div>
                )}
            </motion.div>
            <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                {product.images && product.images.map((img, index) => (
                    <button 
                        key={index} 
                        onClick={() => setActiveImage(img)}
                        className={`w-24 h-24 rounded-2xl border-2 overflow-hidden flex-shrink-0 transition-all ${activeImage === img ? 'border-blue-600 scale-95 shadow-inner' : 'border-transparent bg-gray-50 hover:bg-gray-100'}`}
                    >
                        <img src={img} alt="Product view" className="w-full h-full object-cover" />
                    </button>
                ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-4 mb-4">
                <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em] shadow-lg shadow-blue-100">
                  {product.category}
                </span>
                <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full">
                  <Star size={14} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-black text-yellow-700">{product.rating}</span>
                  <span className="text-xs text-yellow-600/60 font-medium ml-1">({product.stock} in stock)</span>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-black mb-4 text-gray-900 leading-tight tracking-tighter">
                {product.title}
              </h1>
              
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-8 flex items-center gap-2">
                Brand: <span className="text-gray-900 border-b-2 border-blue-400">{product.brand || 'LuxeStore'}</span>
              </p>

              <div className="flex items-end gap-4 mb-10 pb-10 border-b border-gray-100">
                <span className="text-5xl font-black text-gray-900 leading-none">${product.price}</span>
                {product.discountPercentage > 0 && (
                    <div className="flex flex-col justify-end">
                       <span className="text-gray-400 line-through text-lg font-bold">${(product.price / (1 - product.discountPercentage / 100)).toFixed(0)}</span>
                       <span className="text-red-600 text-sm font-black mb-1 flex items-center gap-1 uppercase">Save ${ (product.price * (product.discountPercentage / 100)).toFixed(0) }</span>
                    </div>
                )}
              </div>

              <p className="text-gray-500 mb-10 leading-relaxed text-lg italic">"{product.description}"</p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="flex items-center bg-gray-50 p-2 rounded-2xl border border-gray-100 h-16 sm:w-32">
                  <button onClick={() => setQuantity(q => Math.max(1, q-1))} className="flex-1 flex justify-center text-xl font-bold hover:text-blue-600">-</button>
                  <span className="flex-1 flex justify-center font-black">{quantity}</span>
                  <button onClick={() => setQuantity(q => q+1)} className="flex-1 flex justify-center text-xl font-bold hover:text-blue-600">+</button>
                </div>
                
                <button 
                    onClick={() => addToCart(product, quantity)}
                    className="flex-[3] bg-gray-900 text-white font-black py-4 px-10 rounded-2xl flex items-center justify-center gap-4 hover:bg-black transition-all shadow-2xl uppercase tracking-widest text-sm h-16"
                >
                    <ShoppingCart size={20} /> Add to Cart
                </button>
                
                <button 
                    onClick={() => toggleWishlist(product)}
                    className={`flex-1 h-16 rounded-2xl border-2 flex items-center justify-center transition-all ${isWishlisted ? 'bg-red-50 border-red-200 text-red-500' : 'bg-white border-gray-100 text-gray-400 hover:border-blue-200'}`}
                >
                    <Heart size={24} fill={isWishlisted ? 'currentColor' : 'none'} />
                </button>
              </div>

              {(product.category.includes('shirt') || product.category.includes('dress') || product.category.includes('clothing')) && (
                  <button 
                    onClick={() => setVirtualTryOnOpen(true)}
                    className="w-full bg-blue-50 text-blue-600 font-black py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-blue-100 transition-all border border-blue-100 uppercase tracking-widest text-xs mb-12 shadow-sm"
                  >
                    <Sparkles size={18} /> Try it on Virtually (AI)
                  </button>
              )}

              <div className="grid grid-cols-2 gap-6">
                {[
                  { icon: Truck, label: 'Free Express Shipping', desc: 'On orders over $100' },
                  { icon: RotateCcw, label: '30 Days Return', desc: 'Hassle-free guarantee' },
                  { icon: Shield, label: 'Secure Checkout', desc: '100% data protection' },
                  { icon: MessageSquare, label: '24/7 Support', desc: 'Always here to help' }
                ].map(item => (
                  <div key={item.label} className="flex gap-4">
                     <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-blue-600">
                        <item.icon size={20} />
                     </div>
                     <div>
                        <p className="text-xs font-black text-gray-900 uppercase tracking-wide">{item.label}</p>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest">{item.desc}</p>
                     </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Reviews Section */}
        <ReviewSystem productId={id} />

        {/* Recommendations Section */}
        {relatedProducts.length > 0 && (
          <section className="py-24 border-t border-gray-100">
             <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                <div>
                     <h2 className="text-4xl font-black mb-4 uppercase tracking-tighter text-gray-900">You Might Also Like</h2>
                     <p className="text-gray-500 font-medium uppercase tracking-widest text-xs">Based on your current view of {product.category}</p>
                </div>
                <Link href="/shop" className="text-blue-600 font-black text-sm uppercase tracking-[0.2em] border-b-2 border-blue-600/20 hover:border-blue-600 pb-1 flex items-center gap-2 transition-all">
                  View Full Collection <ChevronRight size={18} />
                </Link>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
               {relatedProducts.map((p) => (
                 <ProductCard key={p.id} product={p} />
               ))}
             </div>
          </section>
        )}
      </div>
      <VirtualTryOn 
        isOpen={virtualTryOnOpen} 
        onClose={() => setVirtualTryOnOpen(false)} 
        product={product}
      />
    </div>
  );
}
