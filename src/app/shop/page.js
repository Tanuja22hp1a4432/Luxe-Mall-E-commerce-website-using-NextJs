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
    <div className="bg-white min-h-screen">
      {/* Shop Header */}
      <div className="bg-gray-50 border-b border-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <nav className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                <Link href="/" className="hover:text-blue-600">Home</Link>
                <span>/</span>
                <span className="text-gray-900">Shop</span>
              </nav>
              <h1 className="text-4xl font-black text-gray-900 uppercase">
                {filters.category ? filters.category.replace('-', ' ') : 'All Collections'}
              </h1>
            </div>
            
            <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
               <div className="relative group">
                  <select 
                    className="appearance-none bg-transparent pl-4 pr-10 py-2 text-sm font-bold text-gray-700 focus:outline-none cursor-pointer"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="featured">Sort By: Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block">
            <FilterSidebar 
              filters={filters} 
              onFilterChange={handleFilterChange} 
              onReset={resetFilters} 
            />
          </aside>

          {/* Mobile Filter Button */}
          <button 
            onClick={() => setShowMobileFilters(true)}
            className="lg:hidden flex items-center justify-center gap-2 bg-gray-900 text-white w-full py-4 rounded-2xl font-black uppercase tracking-widest mb-8"
          >
            <SlidersHorizontal size={20} /> Filters & Sorting
          </button>

          {/* Product Grid */}
          <main className="flex-grow">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="bg-gray-50 rounded-[32px] aspect-[4/5] animate-pulse"></div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <>
                <div className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8 flex justify-between items-center">
                   <span>Showing {filteredProducts.length} Results</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-24 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
                 <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                    <Search size={32} className="text-gray-300" />
                 </div>
                 <h2 className="text-2xl font-black text-gray-900 mb-2">No Products Found</h2>
                 <p className="text-gray-500 mb-8">Try adjusting your filters or search query to find what you're looking for.</p>
                 <button onClick={resetFilters} className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
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
               className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm lg:hidden" 
               onClick={() => setShowMobileFilters(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-4/5 max-w-sm bg-white z-[70] shadow-2xl p-6 overflow-y-auto lg:hidden"
            >
               <div className="flex justify-between items-center mb-8">
                  <span className="text-xl font-black">FILTERS</span>
                  <button onClick={() => setShowMobileFilters(false)} className="p-2 text-gray-500">
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
                  className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest mt-8 shadow-xl"
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
