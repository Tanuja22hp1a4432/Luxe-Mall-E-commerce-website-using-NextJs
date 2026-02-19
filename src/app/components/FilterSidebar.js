'use client';

import { useState, useEffect } from 'react';
import { Filter, Check, ChevronDown, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const categories = [
  { id: 'all', name: 'All Categories' },
  { id: 'beauty', name: 'Beauty' },
  { id: 'fragrances', name: 'Fragrances' },
  { id: 'furniture', name: 'Furniture' },
  { id: 'groceries', name: 'Groceries' },
  { id: 'home-decoration', name: 'Home Decor' },
  { id: 'kitchen-accessories', name: 'Kitchen' },
  { id: 'laptops', name: 'Laptops' },
  { id: 'mobile-accessories', name: 'Gadgets' },
  { id: 'smartphones', name: 'Phones' },
  { id: 'skin-care', name: 'Skincare' },
  { id: 'sports-accessories', name: 'Sports' },
  { id: 'mens-shirts', name: "Men's Shirts" },
  { id: 'womens-dresses', name: "Women's Dresses" },
  { id: 'womens-shoes', name: "Women's Shoes" },
];

const FilterSidebar = ({ filters, onFilterChange, onReset }) => {
  const [isOpen, setIsOpen] = useState({
    categories: true,
    price: true,
    rating: true
  });

  const toggleSection = (section) => {
    setIsOpen(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="w-full lg:w-72 flex-shrink-0 space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
          <Filter size={20} /> FILTERS
        </h2>
        <button 
          onClick={onReset}
          className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 uppercase tracking-widest"
        >
          <RefreshCw size={12} /> Reset
        </button>
      </div>

      {/* Category Section */}
      <div className="border-b border-gray-100 pb-6">
        <button 
          onClick={() => toggleSection('categories')}
          className="flex items-center justify-between w-full mb-4 text-sm font-black uppercase tracking-widest text-gray-900"
        >
          Categories
          <ChevronDown size={16} className={`transition-transform ${isOpen.categories ? '' : '-rotate-90'}`} />
        </button>
        <AnimatePresence initial={false}>
          {isOpen.categories && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-2 overflow-hidden"
            >
              <div className="max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {categories.map((cat) => (
                  <label key={cat.id} className="flex items-center group cursor-pointer py-1">
                    <div className="relative flex items-center">
                      <input 
                        type="checkbox" 
                        className="peer appearance-none w-5 h-5 border-2 border-gray-200 rounded-md checked:bg-blue-600 checked:border-blue-600 transition-all"
                        checked={filters.category === cat.id || (cat.id === 'all' && !filters.category)}
                        onChange={() => onFilterChange('category', cat.id === 'all' ? '' : cat.id)}
                      />
                      <Check size={14} className="absolute left-0.5 top-0.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                    </div>
                    <span className="ml-3 text-sm font-medium text-gray-600 group-hover:text-blue-600 transition-colors">
                      {cat.name}
                    </span>
                  </label>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Price Range Section */}
      <div className="border-b border-gray-100 pb-6">
        <button 
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full mb-6 text-sm font-black uppercase tracking-widest text-gray-900"
        >
          Price Range
          <ChevronDown size={16} className={`transition-transform ${isOpen.price ? '' : '-rotate-90'}`} />
        </button>
        <AnimatePresence>
          {isOpen.price && (
            <motion.div 
               initial={{ height: 0, opacity: 0 }}
               animate={{ height: 'auto', opacity: 1 }}
               exit={{ height: 0, opacity: 0 }}
               className="overflow-hidden"
            >
              <div className="px-2">
                <input 
                  type="range" 
                  min="0" 
                  max="2000" 
                  step="50"
                  className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  value={filters.maxPrice || 2000}
                  onChange={(e) => onFilterChange('maxPrice', parseInt(e.target.value))}
                />
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded">$0</span>
                  <span className="text-sm font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full animate-pulse-slow">
                    Up to ${filters.maxPrice || 2000}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Rating Section */}
      <div className="pb-6">
        <button 
          onClick={() => toggleSection('rating')}
          className="flex items-center justify-between w-full mb-4 text-sm font-black uppercase tracking-widest text-gray-900"
        >
          Minimum Rating
          <ChevronDown size={16} className={`transition-transform ${isOpen.rating ? '' : '-rotate-90'}`} />
        </button>
        <AnimatePresence>
          {isOpen.rating && (
            <motion.div 
               initial={{ height: 0, opacity: 0 }}
               animate={{ height: 'auto', opacity: 1 }}
               exit={{ height: 0, opacity: 0 }}
               className="space-y-3 overflow-hidden"
            >
              {[4, 3, 2].map((star) => (
                <label key={star} className="flex items-center group cursor-pointer">
                  <div className="relative flex items-center">
                    <input 
                      type="radio" 
                      name="rating"
                      className="peer appearance-none w-5 h-5 border-2 border-gray-200 rounded-full checked:border-blue-600 checked:border-[6px] transition-all"
                      checked={filters.minRating === star}
                      onChange={() => onFilterChange('minRating', star)}
                    />
                  </div>
                  <div className="ml-3 flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-sm ${i < star ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
                    ))}
                    <span className="text-xs font-bold text-gray-400 ml-1">& Up</span>
                  </div>
                </label>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Promo Banner in Sidebar */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-800 rounded-3xl p-6 text-white relative overflow-hidden shadow-xl">
         <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
         <h4 className="text-lg font-black mb-2 uppercase leading-tight">New Member Get 20% Off</h4>
         <p className="text-xs text-blue-100 mb-4 opacity-80">Use code WELCOME20 at checkout.</p>
         <Link href="/signup" className="text-xs font-black bg-white text-blue-800 px-4 py-2 rounded-full inline-block">Join Now</Link>
      </div>
    </div>
  );
};

export default FilterSidebar;
