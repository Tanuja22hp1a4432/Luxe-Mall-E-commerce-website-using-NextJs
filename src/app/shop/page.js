'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import { fetchProducts, searchProducts, fetchProductsByCategory } from '../utils/api';
import { Search, Grid, List, ChevronDown, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function ShopContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    maxPrice: 2000,
    minRating: 0,
    search: searchParams.get('search') || ''
  });

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      let data;
      const initialSearch = searchParams.get('search');
      const initialCat = searchParams.get('category');

      if (initialSearch) {
        data = await searchProducts(initialSearch);
      } else if (initialCat && initialCat !== 'all') {
        data = await fetchProductsByCategory(initialCat);
      } else {
        data = await fetchProducts(100); // Increased limit for better shop browsing
      }
      
      setProducts(data.products || []);
      setFilters(prev => ({ 
        ...prev, 
        search: initialSearch || '', 
        category: initialCat || '' 
      }));
      setLoading(false);
    };
    loadProducts();
  }, [searchParams]);

  useEffect(() => {
    let result = [...products];

    // Apply Search
    if (filters.search) {
      result = result.filter(p => 
        p.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        p.category.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Apply Category
    if (filters.category && filters.category !== 'all') {
      result = result.filter(p => p.category === filters.category);
    }

    // Apply Price
    if (filters.maxPrice) {
      result = result.filter(p => p.price <= filters.maxPrice);
    }

    // Apply Rating
    if (filters.minRating) {
      result = result.filter(p => p.rating >= filters.minRating);
    }

    // Apply Sorting
    if (sortBy === 'price-low') result.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-high') result.sort((a, b) => b.price - a.price);
    if (sortBy === 'rating') result.sort((a, b) => b.rating - a.rating);

    setFilteredProducts(result);
  }, [products, filters, sortBy]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({ category: '', maxPrice: 2000, minRating: 0, search: '' });
    setSortBy('featured');
  };

  return (
    <div className="bg-black min-h-screen text-white">
      {/* Shop Header */}
      <div className="bg-white/5 border-b border-white/5 py-12 backdrop-blur-3xl">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <nav className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">
                <Link href="/" className="hover:text-blue-500 transition-colors">Home</Link>
                <span>/</span>
                <span className="text-white">Shop</span>
              </nav>
              <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">
                {filters.category ? filters.category.replace('-', ' ') : 'All Collections'}
              </h1>
            </div>
            
            <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl shadow-sm border border-white/10 backdrop-blur-xl">
               <div className="relative group">
                  <select 
                    className="appearance-none bg-transparent pl-4 pr-10 py-2 text-sm font-black text-white focus:outline-none cursor-pointer uppercase tracking-widest"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="featured" className="bg-black">Sort By: Featured</option>
                    <option value="price-low" className="bg-black">Price: Low to High</option>
                    <option value="price-high" className="bg-black">Price: High to Low</option>
                    <option value="rating" className="bg-black">Top Rated</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-32">
              <FilterSidebar 
                filters={filters} 
                onFilterChange={handleFilterChange} 
                onReset={resetFilters} 
              />
            </div>
          </aside>

          {/* Mobile Filter Button */}
          <button 
            onClick={() => setShowMobileFilters(true)}
            className="lg:hidden flex items-center justify-center gap-3 bg-white text-black w-full py-5 rounded-[24px] font-black uppercase tracking-widest mb-8 hover:bg-blue-600 hover:text-white transition-all shadow-2xl"
          >
            <SlidersHorizontal size={20} /> Filters & Sorting
          </button>

          {/* Product Grid */}
          <main className="flex-grow">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-[40px] aspect-[4/5] animate-pulse"></div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <>
                <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-10 flex justify-between items-center px-2">
                   <span>Showing {filteredProducts.length} Results</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-32 bg-white/5 rounded-[60px] border border-white/10 shadow-2xl">
                 <div className="inline-flex items-center justify-center w-24 h-24 bg-white/5 border border-white/10 rounded-full mb-8">
                    <Search size={40} className="text-gray-700" />
                 </div>
                 <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">No Products Found</h2>
                 <p className="text-gray-500 mb-12 max-w-sm mx-auto font-medium">Try adjusting your filters or search query to find what you're looking for.</p>
                 <button onClick={resetFilters} className="bg-white text-black px-12 py-4 rounded-full font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-xl">
                    Clear All Filters
                 </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Sidebar Overlay */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="fixed inset-0 bg-black/80 z-[100] backdrop-blur-md lg:hidden" 
               onClick={() => setShowMobileFilters(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-4/5 max-w-sm bg-black border-l border-white/10 z-[110] shadow-2xl p-10 overflow-y-auto lg:hidden"
            >
               <div className="flex justify-between items-center mb-12">
                  <span className="text-2xl font-black text-white uppercase tracking-tighter">FILTERS</span>
                  <button onClick={() => setShowMobileFilters(false)} className="p-2 text-white/50 hover:text-white transition-colors">
                    <X size={24} />
                  </button>
               </div>
               <FilterSidebar 
                  filters={filters} 
                  onFilterChange={handleFilterChange} 
                  onReset={resetFilters} 
               />
               <button 
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full bg-white text-black py-5 rounded-[24px] font-black uppercase tracking-widest mt-12 shadow-xl hover:bg-blue-600 hover:text-white transition-all"
               >
                  Apply Filters
               </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>

  );
}

export default function Shop() {
  return (
    <Suspense fallback={<div>Loading shop...</div>}>
      <ShopContent />
    </Suspense>
  );
}

import Link from 'next/link';
import { X } from 'lucide-react';
