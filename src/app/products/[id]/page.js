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
  const [reviewsCount, setReviewsCount] = useState(128);

  useEffect(() => {
    const saved = localStorage.getItem(`reviews_${id}`);
    if (saved) {
      setReviewsCount(128 + JSON.parse(saved).length);
    }
  }, [id]);

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
    <div className="bg-black text-white">
      {/* Breadcrumbs */}
      <div className="bg-black border-b border-white/5 py-4">
        <div className="container mx-auto px-4 flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
           <Link href="/" className="hover:text-blue-500 transition-colors">Home</Link>
           <ChevronRight size={10} />
           <Link href="/shop" className="hover:text-blue-500 transition-colors">Shop</Link>
           <ChevronRight size={10} />
           <span className="text-white truncate">{product.title}</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Image Gallery */}
          <div className="lg:w-1/2">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.05, rotateY: 10, rotateX: -5 }}
              style={{ perspective: 1000 }}
              className="relative aspect-square bg-white/5 rounded-[40px] shadow-2xl overflow-hidden mb-6 flex items-center justify-center p-8 group border border-white/10"
            >
                <motion.img 
                  initial={{ y: 20 }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  src={activeImage || product.thumbnail} 
                  alt={product.title} 
                  className="max-h-full max-w-full object-contain filter drop-shadow-2xl" 
                />
                {product.discountPercentage > 15 && (
                  <div className="absolute top-8 left-8 bg-red-600 text-white font-black px-4 py-2 rounded-full shadow-xl z-20">
                    SALE -{Math.round(product.discountPercentage)}%
                  </div>
                )}
            </motion.div>
            <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                {product.images && product.images.map((img, index) => (
                    <button 
                        key={index} 
                        onClick={() => setActiveImage(img)}
                        className={`w-24 h-24 rounded-2xl border-2 overflow-hidden flex-shrink-0 transition-all ${activeImage === img ? 'border-blue-600 scale-95 shadow-[0_0_20px_rgba(37,99,235,0.3)]' : 'border-transparent bg-white/5 hover:bg-white/10'}`}
                    >
                        <img src={img} alt="Product view" className="w-full h-full object-cover" />
                    </button>
                ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:w-1/2">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
            >
              <motion.div 
                variants={{
                  hidden: { opacity: 0, y: -20 },
                  visible: { opacity: 1, y: 0 }
                }}
                className="flex items-center gap-4 mb-4"
              >
                <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em] shadow-lg shadow-blue-500/20">
                  {product.category}
                </span>
                <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
                  <Star size={14} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-black text-white">{product.rating}</span>
                  <span className="text-[10px] text-gray-500 font-black uppercase ml-1 tracking-widest">({reviewsCount || 128} Reviews)</span>
                </div>
              </motion.div>
              
              <motion.h1 
                variants={{
                  hidden: { opacity: 0, x: 50 },
                  visible: { opacity: 1, x: 0 }
                }}
                className="text-4xl md:text-5xl font-black mb-4 text-gray-900 leading-tight tracking-tighter"
              >
                {product.title}
              </motion.h1>
              
              <motion.p 
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1 }
                }}
                className="text-xs font-black text-gray-400 uppercase tracking-widest mb-8 flex items-center gap-2"
              >
                Brand: <span className="text-gray-900 border-b-2 border-blue-400">{product.brand || 'LuxeStore'}</span>
              </motion.p>

              <motion.div 
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 }
                }}
                className="flex items-end gap-4 mb-10 pb-10 border-b border-white/5"
              >
                <span className="text-5xl font-black text-white leading-none">${product.price}</span>
                {product.discountPercentage > 0 && (
                    <div className="flex flex-col justify-end">
                       <span className="text-gray-500 line-through text-lg font-bold">${(product.price / (1 - product.discountPercentage / 100)).toFixed(0)}</span>
                       <span className="text-red-500 text-sm font-black mb-1 flex items-center gap-1 uppercase">Save ${ (product.price * (product.discountPercentage / 100)).toFixed(0) }</span>
                    </div>
                )}
              </motion.div>

              <motion.p 
                variants={{
                  hidden: { opacity: 0, scale: 0.9 },
                  visible: { opacity: 1, scale: 1 }
                }}
                className="text-gray-400 mb-10 leading-relaxed text-lg italic"
              >
                "{product.description}"
              </motion.p>
              
              <motion.div 
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                className="flex flex-col sm:flex-row gap-4 mb-4"
              >
                <div className="flex items-center bg-white/5 p-2 rounded-2xl border border-white/10 h-16 sm:w-32">
                  <button onClick={() => setQuantity(q => Math.max(1, q-1))} className="flex-1 flex justify-center text-xl font-bold hover:text-blue-500">-</button>
                  <span className="flex-1 flex justify-center font-black">{quantity}</span>
                  <button onClick={() => setQuantity(q => q+1)} className="flex-1 flex justify-center text-xl font-bold hover:text-blue-600">+</button>
                </div>
                
                <button 
                    onClick={() => addToCart(product, quantity)}
                    className="flex-[3] bg-white text-black font-black py-4 px-10 rounded-2xl flex items-center justify-center gap-4 hover:bg-blue-600 hover:text-white hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_20px_50px_rgba(255,255,255,0.1)] uppercase tracking-widest text-sm h-16"
                >
                    <ShoppingCart size={20} /> Add to Cart
                </button>
                
                <button 
                    onClick={(e) => toggleWishlist(product, e)}
                    className={`flex-1 h-16 rounded-2xl border-2 flex items-center justify-center transition-all ${isWishlisted ? 'bg-red-500/10 border-red-500/50 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]' : 'bg-white/5 border-white/10 text-gray-400 hover:border-blue-500/50 hover:scale-110'}`}
                >
                    <Heart size={24} fill={isWishlisted ? 'currentColor' : 'none'} />
                </button>
              </motion.div>

              {(product.category.includes('shirt') || product.category.includes('dress') || product.category.includes('clothing')) && (
                  <button 
                    onClick={() => setVirtualTryOnOpen(true)}
                    className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-blue-500 transition-all border border-blue-500/50 uppercase tracking-[0.2em] text-[10px] mb-8 shadow-2xl grow-btn"
                  >
                    <Sparkles size={18} /> Try it on Virtually (AI)
                  </button>
              )}

              <div className="flex items-center gap-6 mb-12 py-6 border-y border-white/5">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Share:</span>
                <div className="flex gap-4">
                  {[
                    { name: 'Facebook', color: '#1877F2', icon: 'FB' },
                    { name: 'Twitter', color: '#1DA1F2', icon: 'TW' },
                    { name: 'Instagram', color: '#E4405F', icon: 'IG' }
                  ].map(social => (
                    <button 
                      key={social.name}
                      onClick={() => toast(`Sharing to ${social.name}...`)}
                      className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black hover:bg-white hover:text-black transition-all"
                      style={{ '--hover-color': social.color }}
                    >
                      {social.icon}
                    </button>
                  ))}
                </div>
              </div>

                {[
                  { icon: Truck, label: 'Free Express Shipping', desc: 'On orders over $100' },
                  { icon: RotateCcw, label: '30 Days Return', desc: 'Hassle-free guarantee' },
                  { icon: Shield, label: 'Secure Checkout', desc: '100% data protection' },
                  { icon: MessageSquare, label: '24/7 Support', desc: 'Always here to help' }
                ].map(item => (
                  <div key={item.label} className="flex gap-4">
                     <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-blue-500 border border-white/10">
                        <item.icon size={20} />
                     </div>
                     <div>
                        <p className="text-[10px] font-black text-white uppercase tracking-wide">{item.label}</p>
                        <p className="text-[9px] text-gray-500 uppercase tracking-widest">{item.desc}</p>
                     </div>
                  </div>
                ))}
            </motion.div>
          </div>
        </div>
        
        {/* Reviews Section */}
        <ReviewSystem productId={id} />

        {/* Recommendations Section */}
        {relatedProducts.length > 0 && (
          <section className="py-24 border-t border-white/5 mt-12 bg-black/10 backdrop-blur-3xl rounded-[60px] p-12 shadow-2xl">
             <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                <div>
                     <h2 className="text-4xl font-black mb-4 uppercase tracking-tighter text-white">You Might Also Like</h2>
                     <p className="text-gray-500 font-black uppercase tracking-[0.2em] text-[10px]">Based on your view of {product.category}</p>
                </div>
                <Link href="/shop" className="text-blue-500 font-black text-[10px] uppercase tracking-[0.3em] border-b-2 border-blue-500/20 hover:border-blue-500 pb-1 flex items-center gap-2 transition-all">
                  View Full Collection <ChevronRight size={14} />
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
