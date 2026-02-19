'use client';

import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
    User, Package, Heart, LogOut, ChevronRight, 
    Calendar, MapPin, CreditCard, ShoppingBag, 
    RefreshCw, CheckCircle2, Clock, AlertCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReturnModal from '../components/ReturnModal';

export default function Profile() {
  const { user, logout, loading: authLoading } = useAuth();
  const { orders, requestReturn, wishlist } = useShop();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('orders');
  const [selectedOrderForReturn, setSelectedOrderForReturn] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Sidebar Dashboard */}
            <aside className="lg:w-1/3">
                <div className="bg-white p-10 rounded-[40px] shadow-2xl shadow-gray-200 border border-gray-100 flex flex-col items-center text-center">
                    <div className="relative mb-6">
                        <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-blue-50 p-1">
                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-full" />
                        </div>
                        <div className="absolute bottom-1 right-1 bg-green-500 w-6 h-6 rounded-full border-4 border-white shadow-sm"></div>
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">{user.name}</h2>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-2 mb-8">{user.email}</p>
                    
                    <div className="w-full space-y-3">
                        <button 
                            onClick={() => setActiveTab('orders')}
                            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-black uppercase tracking-widest text-xs ${activeTab === 'orders' ? 'bg-gray-900 text-white shadow-xl' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            <Package size={18} /> Order History
                        </button>
                        <button 
                            onClick={() => router.push('/wishlist')}
                            className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-black uppercase tracking-widest text-xs text-gray-500 hover:bg-gray-50"
                        >
                            <Heart size={18} /> My Wishlist
                        </button>
                        <button 
                            onClick={logout}
                            className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-black uppercase tracking-widest text-xs text-red-500 hover:bg-red-50"
                        >
                            <LogOut size={18} /> Sign Out
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 w-full mt-10">
                        <div className="bg-blue-50 p-5 rounded-3xl text-center">
                            <p className="text-2xl font-black text-blue-600 tracking-tighter">{orders.length}</p>
                            <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mt-1">Orders</p>
                        </div>
                         <div className="bg-purple-50 p-5 rounded-3xl text-center">
                            <p className="text-2xl font-black text-purple-600 tracking-tighter">{wishlist.length}</p>
                            <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest mt-1">Saved</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="lg:w-2/3">
                <AnimatePresence mode="wait">
                    {activeTab === 'orders' && (
                        <motion.div
                            key="orders"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <div className="flex justify-between items-end mb-4 px-4">
                                <h3 className="text-4xl font-black text-gray-900 uppercase tracking-tighter">Your Orders</h3>
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Recent Activity</p>
                            </div>

                            {orders.length === 0 ? (
                                <div className="bg-white p-20 rounded-[40px] shadow-2xl shadow-gray-200 border border-gray-100 text-center">
                                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 text-gray-300">
                                        <ShoppingBag size={48} />
                                    </div>
                                    <h4 className="text-2xl font-black text-gray-900 uppercase tracking-tighter mb-4">No orders yet</h4>
                                    <p className="text-gray-500 font-medium mb-10 max-w-sm mx-auto">Looks like you haven't placed any orders yet. Start exploring our collection!</p>
                                    <button onClick={() => router.push('/shop')} className="bg-gray-900 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:bg-black transition-all shadow-xl">
                                        Start Shopping
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {orders.map((order) => (
                                        <motion.div 
                                            key={order.id}
                                            className="bg-white rounded-[40px] shadow-2xl shadow-gray-100 border border-gray-100 overflow-hidden hover:shadow-blue-100/50 transition-all duration-500"
                                        >
                                            <div className="p-8 border-b border-gray-50 bg-gray-50/30 flex flex-wrap justify-between items-center gap-6">
                                                <div className="flex items-center gap-6">
                                                    <div className="bg-white p-4 rounded-3xl shadow-sm ring-1 ring-gray-100">
                                                        <Package size={24} className="text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-black text-gray-900 tracking-tighter text-xl uppercase">{order.id}</h4>
                                                        <div className="flex items-center gap-4 mt-1">
                                                            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                                                <Calendar size={12} /> {order.date}
                                                            </div>
                                                            <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                                                            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                                                <CreditCard size={12} /> {order.billingDetails.paymentMethod.toUpperCase()}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                                        order.status === 'Delivered' ? 'bg-green-50 text-green-600' : 
                                                        order.status === 'Return Requested' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'
                                                    }`}>
                                                        {order.status}
                                                    </span>
                                                    <p className="text-2xl font-black text-gray-900 mt-2 tracking-tighter">${order.total.toFixed(2)}</p>
                                                </div>
                                            </div>

                                            <div className="p-8">
                                                <div className="space-y-6">
                                                    {order.items.map((item, idx) => (
                                                        <div key={idx} className="flex gap-6 items-center">
                                                            <div className="w-20 h-20 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0">
                                                                <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="font-black text-gray-900 uppercase tracking-tighter text-md">{item.title}</p>
                                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Qty: {item.quantity} | Price: ${item.price}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="mt-10 flex flex-wrap gap-4">
                                                    <button className="flex-1 bg-gray-50 text-gray-700 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-100 transition-all flex items-center justify-center gap-2">
                                                        Track Order <Clock size={16} />
                                                    </button>
                                                    
                                                    {order.status === 'Delivered' && (
                                                        <button 
                                                            onClick={() => setSelectedOrderForReturn(order.id)}
                                                            className="flex-1 bg-blue-50 text-blue-600 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-100 transition-all flex items-center justify-center gap-2"
                                                        >
                                                            Request Return <RefreshCw size={16} />
                                                        </button>
                                                    )}
                                                    
                                                    {order.status === 'Return Requested' && (
                                                        <div className="flex-1 bg-orange-50 text-orange-600 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 border border-orange-100">
                                                            Return in Progress <AlertCircle size={16} />
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                {order.returnDetails && (
                                                    <div className="mt-6 p-5 bg-orange-50/30 rounded-3xl border border-orange-100 text-left">
                                                        <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-1">Return Reason</p>
                                                        <p className="text-sm font-bold text-gray-700">{order.returnDetails.reason}</p>
                                                        {order.returnDetails.note && (
                                                            <p className="text-xs text-gray-500 mt-2 italic">"{order.returnDetails.note}"</p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
      </div>

      <ReturnModal 
        isOpen={!!selectedOrderForReturn} 
        onClose={() => setSelectedOrderForReturn(null)} 
        orderId={selectedOrderForReturn}
        onReturnSubmit={requestReturn}
      />
    </div>
  );
}
