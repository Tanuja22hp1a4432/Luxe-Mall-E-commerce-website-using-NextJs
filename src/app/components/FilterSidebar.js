'use client';

import { useState, useEffect } from 'react';
import { Filter, Check, ChevronDown, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

import categoriesData from '../store/db.json';

const FilterSidebar = ({ filters, onFilterChange, onReset }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Add "All" option and map other categories
    const allCats = [
      { id: 'all', name: 'All Categories' },
      ...categoriesData.categories.map(cat => ({
        id: cat.api_category,
        name: cat.name
      }))
    ];
    // Remove duplicates if any (e.g. multiple items sharing same api_category)
    const uniqueCats = allCats.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
    setCategories(uniqueCats);
  }, []);
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
        <h2 className="text-xl font-black text-white flex items-center gap-2 tracking-tighter uppercase">
          <Filter size={20} className="text-blue-500" /> FILTERS
        </h2>
        <button
          onClick={onReset}
          className="text-[10px] font-black text-blue-500 hover:text-white flex items-center gap-1 uppercase tracking-widest transition-colors"
        >
          <RefreshCw size={12} /> Reset
        </button>
      </div>

      {/* Category Section */}
      <div className="border-b border-white/5 pb-6">
        <button
          onClick={() => toggleSection('categories')}
          className="flex items-center justify-between w-full mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-white transition-colors"
        >
          Categories
          <ChevronDown size={14} className={`transition-transform ${isOpen.categories ? '' : '-rotate-90'}`} />
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
                  <label key={cat.id} className="flex items-center group cursor-pointer py-2">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        className="peer appearance-none w-5 h-5 border-2 border-white/10 rounded-md checked:bg-blue-600 checked:border-blue-600 transition-all bg-white/5"
                        checked={filters.category === cat.id || (cat.id === 'all' && !filters.category)}
                        onChange={() => onFilterChange('category', cat.id === 'all' ? '' : cat.id)}
                      />
                      <Check size={14} className="absolute left-0.5 top-0.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                    </div>
                    <span className="ml-3 text-xs font-black text-gray-500 uppercase tracking-widest group-hover:text-blue-500 transition-colors">
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
      <div className="border-b border-white/5 pb-6">
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full mb-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-white transition-colors"
        >
          Price Range
          <ChevronDown size={14} className={`transition-transform ${isOpen.price ? '' : '-rotate-90'}`} />
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
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  value={filters.maxPrice || 2000}
                  onChange={(e) => onFilterChange('maxPrice', parseInt(e.target.value))}
                />
                <div className="flex justify-between items-center mt-6">
                  <span className="text-[10px] font-black text-gray-500 uppercase bg-white/5 px-3 py-1.5 rounded-full border border-white/5">$0</span>
                  <span className="text-[10px] font-black text-blue-500 bg-blue-500/10 px-4 py-2 rounded-full border border-blue-500/20 uppercase tracking-widest">
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
          className="flex items-center justify-between w-full mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-white transition-colors"
        >
          Minimum Rating
          <ChevronDown size={14} className={`transition-transform ${isOpen.rating ? '' : '-rotate-90'}`} />
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
                <label key={star} className="flex items-center group cursor-pointer h-10">
                  <div className="relative flex items-center">
                    <input
                      type="radio"
                      name="rating"
                      className="peer appearance-none w-5 h-5 border-2 border-white/10 rounded-full checked:border-blue-600 checked:border-[6px] transition-all bg-white/5"
                      checked={filters.minRating === star}
                      onChange={() => onFilterChange('minRating', star)}
                    />
                  </div>
                  <div className="ml-3 flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-sm ${i < star ? 'text-yellow-400' : 'text-white/10'}`}>★</span>
                    ))}
                    <span className="text-[10px] font-black text-gray-600 ml-2 uppercase tracking-widest group-hover:text-blue-500 transition-colors">& Up</span>
                  </div>
                </label>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Promo Banner in Sidebar */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-800 rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl border border-white/10">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
        <h4 className="text-xl font-black mb-3 uppercase leading-tight tracking-tighter">New Member Get 20% Off</h4>
        <p className="text-[10px] text-blue-100/70 font-bold mb-6 uppercase tracking-widest">Use code <span className="text-white">WELCOME20</span> at checkout.</p>
        <Link href="/signup" className="text-[10px] font-black bg-white text-black px-6 py-3 rounded-full inline-block uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-xl">Join Now</Link>
      </div>
    </div>
  );
};

export default FilterSidebar;
