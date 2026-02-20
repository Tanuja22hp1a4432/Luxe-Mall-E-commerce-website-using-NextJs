'use client';

import Link from 'next/link';
import { ShoppingCart, Heart, Menu, LogOut, User, Search, X, ChevronDown, Camera, Bell } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import VisualSearchModal from './VisualSearchModal';
import NotificationCenter from './NotificationCenter';

import categoriesData from '../store/db.json';

const Header = () => {
  const [categories, setCategories] = useState([]);
  
  useEffect(() => {
    // Transform db.json categories to header format
    const formattedCategories = categoriesData.categories.map(cat => ({
      name: cat.name,
      path: cat.id === 'food' ? '/food' : `/shop?category=${cat.api_category}`,
      isNew: cat.id === 'food'
    }));
    setCategories(formattedCategories);
  }, []);
  const { cartCount, wishlist } = useShop();
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [visualSearchOpen, setVisualSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${searchQuery}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <header className="fixed w-full z-50">
      {/* Top Banner */}
      <div className="bg-blue-600 text-white py-2 text-center text-[10px] font-black tracking-[0.3em] uppercase">
        FREE SHIPPING ON ALL ORDERS OVER $100 | USE CODE: <span className="text-white underline font-black">LUXE20</span>
      </div>

      {/* Main Header */}
      <div className={`transition-all duration-500 ${scrolled ? 'bg-black/90 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-b border-white/5' : 'bg-transparent'} backdrop-blur-2xl`}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-10">
            <Link href="/" className="text-3xl font-black tracking-tighter text-white group">
              LUXE<span className="text-blue-500 group-hover:text-white transition-colors">STORE</span>
            </Link>
            
            <nav className="hidden lg:flex items-center space-x-8">
              {categories.slice(0, 5).map((cat) => (
                <div key={cat.name} className="group relative py-2">
                  <Link href={cat.path} className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 ${cat.isNew ? 'text-orange-500' : 'text-gray-400 hover:text-white'}`}>
                    {cat.name}
                    {cat.isNew && <span className="text-[8px] bg-orange-500 text-white px-2 py-0.5 rounded-full animate-pulse">NEW</span>}
                    {cat.sub && <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />}
                  </Link>
                  {cat.sub && (
                    <div className="absolute top-full left-0 w-48 bg-white shadow-xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 border-t-2 border-blue-600 rounded-b-lg">
                      {cat.sub.map(s => (
                        <Link key={s} href={`${cat.path}&sub=${s.toLowerCase()}`} className="block px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 hover:text-blue-600">
                          {s}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-5">
            <div className="hidden md:flex items-center relative">
              <form onSubmit={handleSearch} className="flex items-center">
                <input 
                  type="text" 
                  placeholder="Exploration mode..." 
                  className="bg-white/5 border border-white/5 rounded-full py-2.5 pl-12 pr-6 text-xs text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500/50 w-48 lg:w-64 transition-all focus:w-80 backdrop-blur-md"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search size={18} className="absolute left-4 text-gray-500" />
                <button 
                  type="button"
                  onClick={() => setVisualSearchOpen(true)}
                  className="absolute right-4 text-gray-500 hover:text-blue-500 transition-colors"
                >
                  <Camera size={18} />
                </button>
              </form>
            </div>

            <button className="md:hidden text-white" onClick={() => setSearchOpen(true)}>
              <Search size={22} />
            </button>

            <Link href="/wishlist" className="relative text-gray-400 hover:text-red-500 transition-colors">
              <Heart size={22} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-black rounded-full h-4.5 w-4.5 flex items-center justify-center shadow-lg shadow-red-500/30">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link href="/cart" className="relative text-gray-400 hover:text-blue-500 transition-colors">
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-blue-500 text-white text-[10px] font-black rounded-full h-4.5 w-4.5 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  {cartCount}
                </span>
              )}
            </Link>

            <button 
              onClick={() => setNotificationsOpen(true)}
              className="relative text-gray-400 hover:text-blue-500 transition-all hover:bg-white/5 p-2 rounded-xl"
            >
              <Bell size={22} />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-black rounded-full animate-pulse"></span>
            </button>

            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 focus:outline-none"
                >
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full ring-2 ring-gray-100 hover:ring-blue-100 transition-all" />
                </button>
                
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 overflow-hidden"
                    >
                      <div className="px-5 py-3 border-b border-gray-50 mb-1">
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Account</p>
                        <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                      </div>
                      <Link href="/profile" className="flex items-center gap-3 px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                         <User size={16} /> Profile
                      </Link>
                      <button 
                        onClick={() => { logout(); setUserMenuOpen(false); }}
                        className="w-full text-left px-5 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link href="/login" className="hidden md:flex items-center gap-2 bg-gray-900 text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-200">
                Login
              </Link>
            )}

            <button className="lg:hidden text-gray-700" onClick={() => setMobileMenuOpen(true)}>
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white z-[60] p-4 flex flex-col"
          >
            <div className="flex justify-end mb-8">
              <button onClick={() => setSearchOpen(false)} className="p-2 text-gray-500"><X size={32} /></button>
            </div>
            <form onSubmit={handleSearch} className="relative">
              <input 
                autoFocus
                type="text" 
                placeholder="Search products..." 
                className="w-full text-2xl font-bold border-none focus:ring-0 p-0 placeholder-gray-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="mt-8 bg-blue-600 text-white px-8 py-3 rounded-full font-bold w-fit flex items-center gap-2">
                <Search size={20} /> Search
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Sidebar Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm" 
               onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-4/5 max-w-sm bg-white z-[70] shadow-2xl p-6 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8">
                <span className="text-xl font-black">MENU</span>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-gray-500"><X size={24} /></button>
              </div>

              <nav className="flex flex-col space-y-6">
                <Link href="/" className="text-lg font-bold border-b pb-4" onClick={() => setMobileMenuOpen(false)}>Home</Link>
                <div className="space-y-4">
                  <p className="text-xs font-bold text-gray-400 uppercase">Categories</p>
                  {categories.map(cat => (
                    <Link key={cat.name} href={cat.path} className="block text-lg font-medium hover:text-blue-600" onClick={() => setMobileMenuOpen(false)}>
                      {cat.name}
                    </Link>
                  ))}
                </div>
                
                <div className="pt-8 border-t space-y-4">
                   {!user ? (
                     <Link href="/login" className="block text-center bg-gray-900 text-white py-4 rounded-xl font-bold" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                   ) : (
                     <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="w-full bg-red-50 text-red-600 py-4 rounded-xl font-bold">Logout</button>
                   )}
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      </header>
      <VisualSearchModal 
        isOpen={visualSearchOpen} 
        onClose={() => setVisualSearchOpen(false)} 
      />
      <NotificationCenter 
        isOpen={notificationsOpen} 
        onClose={() => setNotificationsOpen(false)} 
      />
    </>
  );
};

export default Header;
