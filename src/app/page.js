'use client';

import { useState, useEffect } from 'react';
import ProductCard from './components/ProductCard';
import { fetchProducts } from './utils/api';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChevronRight, ArrowRight, Star, Zap } from 'lucide-react';
import HeroCarousel from './components/HeroCarousel';

const categoryData = [
  { id: 'womens-dresses', name: "Women's Wear", img: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?q=80&w=1886&auto=format&fit=crop", sub: ["Western", "Dresses", "Traditional"] },
  { id: 'mens-shirts', name: "Men's Wear", img: "https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?q=80&w=2066&auto=format&fit=crop", sub: ["Casual", "Formal", "Shoes"] },
  { id: 'laptops', name: "Electronics", img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop", sub: ["Laptops", "Smartphones", "Accessories"] },
  { id: 'groceries', name: "Groceries", img: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1974&auto=format&fit=crop", sub: ["Fresh", "Snacks", "Household"] }
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ h: 12, m: 45, s: 30 });

  useEffect(() => {
    const loadProducts = async () => {
      const data = await fetchProducts(8);
      setProducts(data.products);
      setLoading(false);
    };
    loadProducts();

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 };
        if (prev.h > 0) return { ...prev, h: prev.h - 1, m: 59, s: 59 };
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Dynamic Hero Carousel */}
      <HeroCarousel />

      {/* Category Grid */}
      <section className="py-24 container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black text-white mb-6 uppercase tracking-tighter">Explore Ecosystem</h2>
          <p className="text-gray-500 max-w-md mx-auto font-black uppercase tracking-[0.2em] text-[10px]">Curated collections for the modern lifestyle</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categoryData.map((cat) => (
            <motion.div
              key={cat.id}
              whileHover={{ y: -15, scale: 1.02 }}
              className="group relative h-[550px] rounded-[50px] overflow-hidden cursor-pointer border border-white/5 shadow-2xl"
            >
              <img src={cat.img} alt={cat.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-125 group-hover:rotate-3" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex flex-col justify-end p-10 text-white">
                <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter">{cat.name}</h3>
                <div className="flex flex-wrap gap-2 mb-8 opacity-0 group-hover:opacity-100 transition-all translate-y-10 group-hover:translate-y-0 duration-500">
                  {cat.sub.map(s => (
                    <span key={s} className="text-[10px] font-black bg-white/10 backdrop-blur-3xl px-4 py-2 rounded-full uppercase tracking-widest border border-white/10">{s}</span>
                  ))}
                </div>
                <Link href={`/shop?category=${cat.id}`} className="flex items-center gap-3 font-black text-[10px] text-blue-500 uppercase tracking-[0.2em] group/link">
                  Enter Collection <ArrowRight size={16} className="group-hover/link:translate-x-2 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Live Deals Section */}
      <section className="bg-black/20 py-32 overflow-hidden border-y border-white/5 backdrop-blur-3xl">
        <div className="container mx-auto px-4">
          <div className="bg-white/5 rounded-[60px] border border-white/10 shadow-2xl overflow-hidden flex flex-col lg:flex-row relative">
            <div className="lg:w-1/3 bg-white/5 p-16 text-white flex flex-col justify-center relative overflow-hidden border-r border-white/10">
              <Zap className="absolute -top-10 -right-10 text-blue-600/10" size={300} />
              <div className="relative z-10 text-center lg:text-left">
                <div className="inline-flex items-center gap-3 bg-blue-600/20 text-blue-500 text-[10px] font-black px-4 py-2 rounded-full mb-8 uppercase tracking-[0.3em] border border-blue-500/30">
                   Flash Orbit
                </div>
                <h2 className="text-5xl font-black mb-6 uppercase tracking-tighter">Deals of the Orbit</h2>
                <p className="text-gray-500 mb-12 font-medium">Limited windows of opportunity. Secure yours before they descend.</p>
                
                <div className="flex justify-center lg:justify-start gap-4 mb-12">
                   {[
                     { label: 'Hrs', val: timeLeft.h },
                     { label: 'Min', val: timeLeft.m },
                     { label: 'Sec', val: timeLeft.s }
                   ].map(t => (
                     <div key={t.label} className="text-center group">
                       <div className="bg-white/5 border border-white/10 group-hover:border-blue-500/50 transition-all backdrop-blur-3xl w-20 h-20 rounded-[24px] flex items-center justify-center text-3xl font-black mb-2 shadow-inner">
                         {t.val.toString().padStart(2, '0')}
                       </div>
                       <span className="text-[10px] uppercase font-black text-gray-600 tracking-[0.2em]">{t.label}</span>
                     </div>
                   ))}
                </div>
                <Link href="/shop" className="group inline-flex items-center gap-3 font-black text-blue-500 text-[10px] uppercase tracking-[0.3em] border-b border-blue-500/20 pb-2 hover:border-blue-500 transition-all">
                  Access All Deals <ChevronRight size={18} className="group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
            </div>
            
            <div className="lg:w-2/3 p-16 lg:p-24 relative">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
                  {products.slice(0, 2).map(product => (
                    <div key={product.id} className="group relative">
                       <div className="relative aspect-square rounded-[40px] overflow-hidden mb-8 bg-white/5 border border-white/10 shadow-2xl">
                          <img src={product.thumbnail} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                          <div className="absolute top-6 left-6 bg-red-600 text-white font-black px-4 py-2 rounded-full text-[10px] uppercase tracking-widest shadow-xl">
                             -{Math.round(product.discountPercentage)}%
                          </div>
                       </div>
                       <h3 className="text-2xl font-black mb-3 group-hover:text-blue-500 transition-colors uppercase tracking-widest text-white">{product.title}</h3>
                       <div className="flex items-center gap-4">
                          <span className="text-3xl font-black text-white">${product.price}</span>
                          <span className="text-xl text-gray-600 line-through font-bold">${(product.price / (1 - product.discountPercentage / 100)).toFixed(0)}</span>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Grid */}
      <section className="py-32 container mx-auto px-4 relative">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8 text-center md:text-left">
            <div>
                 <h2 className="text-5xl font-black mb-6 uppercase tracking-tighter text-white">Hyper-Trending</h2>
                 <p className="text-gray-500 font-black uppercase tracking-[0.2em] text-[10px]">Evolving the standard of curated performance</p>
            </div>
            <Link href="/shop" className="bg-white/5 border border-white/10 hover:bg-white hover:text-black px-12 py-4 rounded-full font-black text-[10px] uppercase tracking-[0.3em] transition-all shadow-xl">
              Launch Full Store
            </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-[40px] h-[550px] animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
      
       {/* Newsletter Section */}
       <section className="py-32 bg-black overflow-hidden relative border-t border-white/5">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto rounded-[80px] bg-gradient-to-br from-blue-600/10 to-purple-800/10 border border-white/10 p-16 lg:p-32 text-center relative overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)]">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-[150px]"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-[150px]"></div>
                    
                    <div className="relative z-10">
                      <div className="w-20 h-20 bg-white/5 rounded-[32px] flex items-center justify-center mx-auto mb-10 border border-white/10">
                        <Star className="text-yellow-400" size={32} fill="currentColor" />
                      </div>
                      <h2 className="text-5xl md:text-7xl font-black mb-8 uppercase tracking-tighter text-white">Join the Luxe HUD</h2>
                      <p className="mb-16 text-gray-400 text-xl max-w-2xl mx-auto font-medium leading-relaxed">Early access to drops, hyper-exclusive events, and the future of the Luxe Collective ecosystem.</p>
                      
                      <form className="max-w-xl mx-auto flex flex-col sm:flex-row gap-6">
                          <input 
                            type="email" 
                            placeholder="orbital@connection.com" 
                            className="flex-grow px-10 py-6 bg-white/5 border border-white/10 rounded-full text-white focus:outline-none focus:border-blue-500 font-black uppercase tracking-[0.2em] text-xs shadow-inner" 
                          />
                          <button className="bg-white text-black px-12 py-6 rounded-full font-black uppercase tracking-[0.2em] text-xs hover:bg-blue-600 hover:text-white transition-all transform hover:scale-105 shadow-[0_20px_40px_rgba(255,255,255,0.1)]">
                            Initiate
                          </button>
                      </form>
                      <p className="mt-12 text-[9px] text-gray-600 font-black uppercase tracking-[0.3em]">Protocol active • End-to-end encrypted</p>
                    </div>
                </div>
            </div>
       </section>
    </div>
  );
}
