'use client';

import { useState, useEffect } from 'react';
import ProductCard from './components/ProductCard';
import { fetchProducts } from './utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ShoppingBag, Clock, ArrowRight, Star, Zap } from 'lucide-react';

const promotions = [
  {
    title: "Summer Collection 2026",
    subtitle: "Up to 50% Off",
    description: "Experience the ultimate style with our new summer arrivals. Limited time offer.",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop",
    color: "from-orange-500 to-red-600"
  },
  {
    title: "Premium Tech Gears",
    subtitle: "New Arrivals",
    description: "Upgrade your lifestyle with the latest gadgets and premium tech accessories.",
    image: "https://images.unsplash.com/photo-1491933382434-500287f9b54b?q=80&w=2000&auto=format&fit=crop",
    color: "from-blue-600 to-purple-700"
  },
  {
    title: "Home Essentials",
    subtitle: "Best Deals",
    description: "Transform your living space with our curated collection of home and pantry essentials.",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=2070&auto=format&fit=crop",
    color: "from-green-500 to-teal-600"
  }
];

const categoryData = [
  { id: 'womens-dresses', name: "Women's Wear", img: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?q=80&w=1886&auto=format&fit=crop", sub: ["Western", "Dresses", "Traditional"] },
  { id: 'mens-shirts', name: "Men's Wear", img: "https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?q=80&w=2066&auto=format&fit=crop", sub: ["Casual", "Formal", "Shoes"] },
  { id: 'laptops', name: "Electronics", img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop", sub: ["Laptops", "Smartphones", "Accessories"] },
  { id: 'groceries', name: "Groceries", img: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1974&auto=format&fit=crop", sub: ["Fresh", "Snacks", "Household"] }
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [promoIndex, setPromoIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ h: 12, m: 45, s: 30 });

  useEffect(() => {
    const loadProducts = async () => {
      const data = await fetchProducts(8);
      setProducts(data.products);
      setLoading(false);
    };
    loadProducts();

    // Promo slider interval
    const interval = setInterval(() => {
      setPromoIndex((prev) => (prev + 1) % promotions.length);
    }, 5000);

    // Countdown timer interval
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 };
        if (prev.h > 0) return { ...prev, h: prev.h - 1, m: 59, s: 59 };
        return prev;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Dynamic Hero Slider */}
      <section className="relative h-[650px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={promoIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0 bg-black/30 z-10"></div>
            <img 
              src={promotions[promoIndex].image} 
              alt={promotions[promoIndex].title} 
              className="w-full h-full object-cover"
            />
            <div className="container mx-auto px-4 h-full flex flex-col justify-center relative z-20">
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-white text-lg font-bold mb-4 uppercase tracking-[0.3em]"
              >
                {promotions[promoIndex].subtitle}
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-6xl md:text-8xl font-black text-white mb-6 leading-none"
              >
                {promotions[promoIndex].title.split(' ')[0]} <br />
                <span className={`bg-gradient-to-r ${promotions[promoIndex].color} bg-clip-text text-transparent`}>
                  {promotions[promoIndex].title.split(' ').slice(1).join(' ')}
                </span>
              </motion.h1>
              <motion.p
                 initial={{ opacity: 0, y: 30 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.4 }}
                 className="text-xl text-gray-200 max-w-lg mb-10 leading-relaxed"
              >
                {promotions[promoIndex].description}
              </motion.p>
              <motion.div
                 initial={{ opacity: 0, y: 30 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.6 }}
                 className="flex gap-4"
              >
                  <Link href="/shop" className="bg-white text-gray-900 px-10 py-4 rounded-full font-black hover:bg-blue-600 hover:text-white transition-all transform hover:scale-105 shadow-2xl flex items-center gap-2">
                    Shop Now <ShoppingBag size={20} />
                  </Link>
                  <Link href="/shop" className="bg-white/10 backdrop-blur-md text-white border border-white/30 px-10 py-4 rounded-full font-black hover:bg-white/20 transition-all">
                    View Details
                  </Link>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-3">
          {promotions.map((_, i) => (
            <button 
              key={i} 
              onClick={() => setPromoIndex(i)}
              className={`h-1.5 transition-all rounded-full ${promoIndex === i ? 'w-12 bg-white' : 'w-4 bg-white/40'}`}
            />
          ))}
        </div>
      </section>

      {/* Category Grid */}
      <section className="py-24 container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-gray-900 mb-4">Shop by Category</h2>
          <p className="text-gray-500 max-w-md mx-auto">Explore our wide range of premium products tailored just for you.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categoryData.map((cat, i) => (
            <motion.div
              key={cat.id}
              whileHover={{ y: -10 }}
              className="group relative h-[450px] rounded-3xl overflow-hidden cursor-pointer"
            >
              <img src={cat.img} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent flex flex-col justify-end p-8 text-white">
                <h3 className="text-2xl font-bold mb-2">{cat.name}</h3>
                <div className="flex flex-wrap gap-2 mb-6 opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0 duration-300">
                  {cat.sub.map(s => (
                    <span key={s} className="text-xs bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">{s}</span>
                  ))}
                </div>
                <Link href={`/shop?category=${cat.id}`} className="flex items-center gap-2 font-bold text-sm text-blue-400">
                  Browse Category <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Live Deals Section */}
      <section className="bg-gray-50 py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-[40px] shadow-xl overflow-hidden flex flex-col lg:flex-row">
            <div className="lg:w-1/3 bg-gray-900 p-12 text-white flex flex-col justify-center relative overflow-hidden">
              <Zap className="absolute -top-10 -right-10 text-blue-600/20" size={300} />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-blue-600 text-xs font-bold px-3 py-1 rounded-full mb-6 uppercase tracking-widest">
                   Flash Sale
                </div>
                <h2 className="text-4xl font-black mb-6">Deals of the Day</h2>
                <p className="text-gray-400 mb-10">Don't miss out on these limited-time offers. Grab them before they're gone!</p>
                
                <div className="flex gap-4 mb-10">
                   {[
                     { label: 'Hrs', val: timeLeft.h },
                     { label: 'Min', val: timeLeft.m },
                     { label: 'Sec', val: timeLeft.s }
                   ].map(t => (
                     <div key={t.label} className="text-center">
                       <div className="bg-white/10 backdrop-blur-md w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black mb-1">
                         {t.val.toString().padStart(2, '0')}
                       </div>
                       <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider font-mono">{t.label}</span>
                     </div>
                   ))}
                </div>
                <Link href="/shop" className="group inline-flex items-center gap-2 font-bold text-blue-400 border-b border-blue-400/50 pb-1 hover:border-blue-400 transition-all">
                  View All Deals <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
            
            <div className="lg:w-2/3 p-12 lg:p-16">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {products.slice(0, 2).map(product => (
                    <div key={product.id} className="group">
                       <div className="relative aspect-square rounded-3xl overflow-hidden mb-6 bg-gray-100 shadow-sm">
                          <img src={product.thumbnail} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute top-4 left-4 bg-red-600 text-white font-black px-3 py-1 rounded-full text-sm">
                             -{Math.round(product.discountPercentage)}%
                          </div>
                       </div>
                       <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{product.title}</h3>
                       <div className="flex items-center gap-3">
                          <span className="text-2xl font-black text-gray-900">${product.price}</span>
                          <span className="text-lg text-gray-400 line-through">${(product.price / (1 - product.discountPercentage / 100)).toFixed(0)}</span>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Grid */}
      <section className="py-24 container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6 text-center md:text-left">
            <div>
                 <h2 className="text-4xl font-black mb-4">Trending Now</h2>
                 <p className="text-gray-500">Discover the products that everyone's talking about.</p>
            </div>
            <Link href="/shop" className="bg-gray-100 hover:bg-gray-200 px-8 py-3 rounded-full font-bold transition-colors">
              Explore All Products
            </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-50 rounded-3xl h-[450px] animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
      
       {/* Newsletter Section */}
       <section className="py-24 bg-gray-950 text-white">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto rounded-[60px] bg-gradient-to-br from-blue-600 to-purple-800 p-12 lg:p-20 text-center relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                    <div className="relative z-10">
                      <Star className="text-yellow-400 mx-auto mb-8 animate-pulse" size={40} fill="currentColor" />
                      <h2 className="text-4xl md:text-5xl font-black mb-6">Join the Luxe Collective</h2>
                      <p className="mb-10 text-blue-100 text-lg max-w-xl mx-auto opacity-80">Be the first to know about new arrivals, private sales, and fashion events.</p>
                      <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
                          <input type="email" placeholder="email@example.com" className="flex-grow px-8 py-5 rounded-full text-gray-900 focus:outline-none font-medium shadow-xl" />
                          <button className="bg-gray-950 text-white px-10 py-5 rounded-full font-black hover:bg-gray-800 transition-all transform hover:scale-105 shadow-xl">
                            Subscribe
                          </button>
                      </form>
                      <p className="mt-8 text-xs text-white/50">By subscribing, you agree to our Terms of Service & Privacy Policy.</p>
                    </div>
                </div>
            </div>
       </section>
    </div>
  );
}
