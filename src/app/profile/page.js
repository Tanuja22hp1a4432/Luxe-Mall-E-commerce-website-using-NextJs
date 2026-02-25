'use client';

import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    User, Package, Heart, LogOut, ChevronRight,
    Calendar, MapPin, CreditCard, ShoppingBag,
    RefreshCw, CheckCircle2, Clock, AlertCircle,
    Settings, Camera, Save, Mail, Phone, Edit, ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReturnModal from '../components/ReturnModal';

export default function Profile() {
    const { user, logout, loading: authLoading, updateUser } = useAuth();
    const { orders, requestReturn, wishlist } = useShop();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('orders');
    const [selectedOrderForReturn, setSelectedOrderForReturn] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    });

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '+1 234 567 890',
                address: user.address || '123 Luxe Lane, Fashion City'
            });
        }
    }, [user, authLoading, router]);

    const handleUpdateProfile = (e) => {
        e.preventDefault();
        updateUser(formData);
        setIsEditing(false);
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                updateUser({ avatar: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    if (authLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="bg-black min-h-screen text-white pt-32 pb-20">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="flex flex-col lg:flex-row gap-12">

                    {/* Sidebar Dashboard */}
                    <aside className="lg:w-1/3">
                        <div className="bg-white/5 p-10 rounded-[40px] shadow-3xl border border-white/10 backdrop-blur-3xl flex flex-col items-center text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                            <div className="relative mb-8">
                                <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-white/5 p-1 group relative">
                                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-full transition-all group-hover:opacity-50" />
                                    <label className="absolute inset-0 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 rounded-full">
                                        <Camera className="text-white" size={24} />
                                        <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                                    </label>
                                </div>
                                <div className="absolute bottom-1 right-1 bg-green-500 w-6 h-6 rounded-full border-4 border-black shadow-lg"></div>
                            </div>
                            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">{user.name}</h2>
                            <p className="text-gray-500 font-black uppercase tracking-[0.3em] text-[10px] mt-3 mb-10">{user.email}</p>

                            <div className="w-full space-y-3">
                                <button
                                    onClick={() => setActiveTab('orders')}
                                    className={`w-full flex items-center gap-4 px-8 py-5 rounded-[24px] transition-all font-black uppercase tracking-widest text-[10px] ${activeTab === 'orders' ? 'bg-white text-black shadow-2xl scale-105' : 'text-gray-500 hover:bg-white/5 hover:text-white'}`}
                                >
                                    <Package size={18} /> Order History
                                </button>
                                <button
                                    onClick={() => setActiveTab('settings')}
                                    className={`w-full flex items-center gap-4 px-8 py-5 rounded-[24px] transition-all font-black uppercase tracking-widest text-[10px] ${activeTab === 'settings' ? 'bg-white text-black shadow-2xl scale-105' : 'text-gray-500 hover:bg-white/5 hover:text-white'}`}
                                >
                                    <Settings size={18} /> Profile Settings
                                </button>
                                <button
                                    onClick={() => router.push('/wishlist')}
                                    className="w-full flex items-center gap-4 px-8 py-5 rounded-[24px] transition-all font-black uppercase tracking-widest text-[10px] text-gray-500 hover:bg-white/5 hover:text-white"
                                >
                                    <Heart size={18} /> My Wishlist
                                </button>
                                <button
                                    onClick={logout}
                                    className="w-full flex items-center gap-4 px-8 py-5 rounded-[24px] transition-all font-black uppercase tracking-widest text-[10px] text-red-500 hover:bg-red-500/10"
                                >
                                    <LogOut size={18} /> Sign Out
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4 w-full mt-12">
                                <div className="bg-white/5 p-6 rounded-[32px] text-center border border-white/5 shadow-inner">
                                    <p className="text-3xl font-black text-blue-500 tracking-tighter">{orders.length}</p>
                                    <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mt-2">Orders</p>
                                </div>
                                <div className="bg-white/5 p-6 rounded-[32px] text-center border border-white/5 shadow-inner">
                                    <p className="text-3xl font-black text-purple-500 tracking-tighter">{wishlist.length}</p>
                                    <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mt-2">Saved</p>
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
                                    className="space-y-10"
                                >
                                    <div className="flex justify-between items-end mb-6 px-6">
                                        <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">Your Orders</h3>
                                        <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.3em] mb-2">Recent activity</p>
                                    </div>

                                    {orders.length === 0 ? (
                                        <div className="bg-white/5 p-24 rounded-[60px] border border-white/10 shadow-3xl text-center backdrop-blur-3xl">
                                            <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-10 text-gray-700 shadow-inner">
                                                <ShoppingBag size={48} />
                                            </div>
                                            <h4 className="text-3xl font-black text-white uppercase tracking-tighter mb-6">No orders yet</h4>
                                            <p className="text-gray-500 font-medium mb-12 max-w-sm mx-auto leading-relaxed">Your journey with Luxe Mall starts with your first piece. Explore our collection today!</p>
                                            <button onClick={() => router.push('/shop')} className="bg-white text-black px-12 py-5 rounded-full font-black uppercase tracking-[0.2em] text-xs hover:bg-blue-600 hover:text-white transition-all shadow-2xl">
                                                Start Shopping
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-8">
                                            {orders.map((order) => (
                                                <motion.div
                                                    key={order.id}
                                                    className="bg-white/5 rounded-[50px] border border-white/10 shadow-3xl overflow-hidden hover:border-blue-500/30 transition-all duration-700 group"
                                                >
                                                    <div className="p-10 border-b border-white/5 bg-white/5 flex flex-wrap justify-between items-center gap-8">
                                                        <div className="flex items-center gap-8">
                                                            <div className="bg-white/5 p-5 rounded-[24px] shadow-inner border border-white/5 group-hover:border-blue-500/20 transition-colors">
                                                                <Package size={28} className="text-blue-500" />
                                                            </div>
                                                            <div>
                                                                <h4 className="font-black text-white tracking-tighter text-2xl uppercase">{order.id}</h4>
                                                                <div className="flex items-center gap-6 mt-2">
                                                                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                                                        <Calendar size={14} className="text-gray-700" /> {order.date}
                                                                    </div>
                                                                    <span className="w-1.5 h-1.5 rounded-full bg-white/10"></span>
                                                                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                                                        <CreditCard size={14} className="text-gray-700" /> {order.billingDetails.paymentMethod.toUpperCase()}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col items-end">
                                                            <span className={`px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border ${order.status === 'Delivered' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                                                    order.status === 'Return Requested' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                                                }`}>
                                                                {order.status}
                                                            </span>
                                                            <p className="text-3xl font-black text-white mt-3 tracking-tighter">${order.total.toFixed(2)}</p>
                                                        </div>
                                                    </div>

                                                    <div className="p-10">
                                                        <div className="space-y-8">
                                                            {order.items.map((item, idx) => (
                                                                <div key={idx} className="flex gap-8 items-center">
                                                                    <div className="w-24 h-24 bg-white rounded-[24px] overflow-hidden flex-shrink-0 shadow-lg p-2">
                                                                        <img src={item.thumbnail} alt={item.title} className="w-full h-full object-contain" />
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <p className="font-black text-white uppercase tracking-tighter text-lg mb-1">{item.title}</p>
                                                                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Qty: {item.quantity} • Price: ${item.price}</p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>

                                                        <div className="mt-12 flex flex-wrap gap-5">
                                                            <button className="flex-1 bg-white/5 border border-white/10 text-white py-5 rounded-[24px] font-black uppercase tracking-widest text-[10px] hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3 shadow-xl">
                                                                Track Order <Clock size={18} />
                                                            </button>

                                                            {order.status === 'Delivered' && (
                                                                <button
                                                                    onClick={() => setSelectedOrderForReturn(order.id)}
                                                                    className="flex-1 bg-blue-600/10 border border-blue-600/20 text-blue-500 py-5 rounded-[24px] font-black uppercase tracking-widest text-[10px] hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-3 shadow-xl"
                                                                >
                                                                    Request Return <RefreshCw size={18} />
                                                                </button>
                                                            )}

                                                            {order.status === 'Return Requested' && (
                                                                <div className="flex-1 bg-orange-600/10 border border-orange-600/20 text-orange-500 py-5 rounded-[24px] font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3">
                                                                    Return in Progress <AlertCircle size={18} />
                                                                </div>
                                                            )}
                                                        </div>

                                                        {order.returnDetails && (
                                                            <div className="mt-8 p-8 bg-orange-500/5 rounded-[32px] border border-orange-500/10 text-left">
                                                                <p className="text-[9px] font-black text-orange-500 uppercase tracking-[0.3em] mb-2">Return reason details</p>
                                                                <p className="text-sm font-black text-white mb-2">{order.returnDetails.reason}</p>
                                                                {order.returnDetails.note && (
                                                                    <p className="text-xs text-gray-500 italic opacity-80">"{order.returnDetails.note}"</p>
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

                            {activeTab === 'settings' && (
                                <motion.div
                                    key="settings"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-10"
                                >
                                    <div className="flex justify-between items-end mb-6 px-6">
                                        <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">Profile Settings</h3>
                                        <button
                                            onClick={() => setIsEditing(!isEditing)}
                                            className={`flex items-center gap-3 px-8 py-4 rounded-full font-black uppercase tracking-widest text-[10px] transition-all shadow-xl ${isEditing ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                                        >
                                            {isEditing ? <><ArrowLeft size={16} /> Cancel</> : <><Edit size={16} /> Edit Profile</>}
                                        </button>
                                    </div>

                                    <div className="bg-white/5 p-12 rounded-[50px] border border-white/10 shadow-3xl backdrop-blur-3xl">
                                        <form onSubmit={handleUpdateProfile} className="space-y-10">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-4">Full Name</label>
                                                    <div className="relative">
                                                        <User className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
                                                        <input
                                                            type="text"
                                                            disabled={!isEditing}
                                                            value={formData.name}
                                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                            className="w-full bg-white/5 border border-white/5 rounded-3xl py-6 pl-16 pr-8 font-black text-white focus:ring-2 focus:ring-blue-600/50 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-xs"
                                                            placeholder="Enter your name"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-4">Email Address</label>
                                                    <div className="relative">
                                                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
                                                        <input
                                                            type="email"
                                                            disabled={!isEditing}
                                                            value={formData.email}
                                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                            className="w-full bg-white/5 border border-white/5 rounded-3xl py-6 pl-16 pr-8 font-black text-white focus:ring-2 focus:ring-blue-600/50 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-xs"
                                                            placeholder="email@example.com"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-4">Phone Number</label>
                                                    <div className="relative">
                                                        <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
                                                        <input
                                                            type="tel"
                                                            disabled={!isEditing}
                                                            value={formData.phone}
                                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                            className="w-full bg-white/5 border border-white/5 rounded-3xl py-6 pl-16 pr-8 font-black text-white focus:ring-2 focus:ring-blue-600/50 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-xs"
                                                            placeholder="+1 (555) 000-0000"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-4">Shipping Address</label>
                                                    <div className="relative">
                                                        <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
                                                        <input
                                                            type="text"
                                                            disabled={!isEditing}
                                                            value={formData.address}
                                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                            className="w-full bg-white/5 border border-white/5 rounded-3xl py-6 pl-16 pr-8 font-black text-white focus:ring-2 focus:ring-blue-600/50 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-xs"
                                                            placeholder="Street, City, Country"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {isEditing && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className="pt-10"
                                                >
                                                    <button
                                                        type="submit"
                                                        className="w-full bg-white text-black py-6 rounded-[32px] font-black uppercase tracking-[0.3em] text-xs flex items-center justify-center gap-4 hover:bg-blue-600 hover:text-white transition-all shadow-2xl hover:scale-[1.02] active:scale-95"
                                                    >
                                                        <Save size={20} /> Save Changes
                                                    </button>
                                                </motion.div>
                                            )}
                                        </form>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </main>
                </div>
            </div>

        </div>
    );
}
