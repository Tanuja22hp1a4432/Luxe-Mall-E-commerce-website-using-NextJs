'use client';

import { useState } from 'react';
import {
    Search, MapPin, Star, Clock, Utensils,
    Pizza, Beef, Coffee,
    ShoppingBag, Trash2, Plus, Minus, CheckCircle2,
    Bike, Award, ShieldCheck, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const categories = [
    { name: 'Pizza', icon: Pizza, color: 'bg-red-50 text-red-600' },
    { name: 'Burgers', icon: Beef, color: 'bg-orange-50 text-orange-600' },
    { name: 'Cakes', icon: Utensils, color: 'bg-pink-50 text-pink-600' }, // Changed Sushi to Cakes for request
    { name: 'Gifts', icon: ShoppingBag, color: 'bg-purple-50 text-purple-600' },
    { name: 'Coffee', icon: Coffee, color: 'bg-brown-50 text-amber-700' },
];

const restaurants = [
    {
        id: 1,
        name: "Luxe Italy Pizzeria",
        rating: 4.8,
        time: "20-30 min",
        tag: "Italian • Pizza",
        img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop",
        isPromoted: true,
        menu: [
            { id: 101, name: "Margherita Pizza", price: 12.99, img: "https://images.unsplash.com/photo-1574071318508-1cdbad80ad38?q=80&w=2070&auto=format&fit=crop" },
            { id: 102, name: "Pepperoni Feast", price: 15.99, img: "https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=2080&auto=format&fit=crop" }
        ]
    },
    {
        id: 2,
        name: "Celebration Central",
        rating: 4.9,
        time: "10-20 min",
        tag: "Cakes • Gifts • Party Kits",
        img: "https://images.unsplash.com/photo-1535141192574-5d4897c12636?q=80&w=1888&auto=format&fit=crop",
        isPromoted: true,
        menu: [
            { id: 401, name: "Premium Birthday Cake", price: 25.00, img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=2089&auto=format&fit=crop" },
            { id: 402, name: "Celebration Kit (Accessories)", price: 15.00, img: "https://images.unsplash.com/photo-1530103043960-ef38714abb15?q=80&w=2070&auto=format&fit=crop" },
            { id: 403, name: "Luxury Gift Article", price: 45.00, img: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=2030&auto=format&fit=crop" }
        ]
    },
    {
        id: 3,
        name: "Gourmet Burger Lab",
        rating: 4.9,
        time: "15-25 min",
        tag: "Fast Food • Burgers",
        img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1899&auto=format&fit=crop",
        isPromoted: false,
        menu: [
            { id: 201, name: "Signature Truffle Burger", price: 14.50, img: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1965&auto=format&fit=crop" },
            { id: 202, name: "Classic Cheese", price: 9.99, img: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?q=80&w=2015&auto=format&fit=crop" }
        ]
    }
];

export default function FoodPage() {
    const [selectedCategory, setSelectedCategory] = useState('Pizza');
    const [searchQuery, setSearchQuery] = useState('');
    const [cart, setCart] = useState([]);
    const [isCheckout, setIsCheckout] = useState(false);
    const [orderDone, setOrderDone] = useState(false);
    const [isUrgent, setIsUrgent] = useState(false);

    const addToCart = (item, restaurantName) => {
        setCart(prev => {
            const exists = prev.find(i => i.id === item.id);
            if (exists) {
                return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, { ...item, restaurantName, quantity: 1 }];
        });
        toast.success(`Added ${item.name} to food cart`);
    };

    const removeFromCart = (id) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const updateQuantity = (id, delta) => {
        setCart(prev => prev.map(item =>
            item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
        ));
    };

    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const handleCheckout = () => {
        setIsCheckout(true);
        // Urgent delivery reduces simulated time
        const processTime = isUrgent ? 1500 : 3000;
        setTimeout(() => {
            setOrderDone(true);
            setCart([]);
            setTimeout(() => {
                setIsCheckout(false);
                setOrderDone(false);
            }, 10000); // Keep tracking modal open longer for user to see
        }, processTime);
    };

    return (
        <div className="bg-black min-h-screen pt-32 pb-20 text-white">
            <div className="container mx-auto px-4">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
                    <div className="text-left w-full md:w-auto">
                        <div className="flex items-center gap-2 text-orange-500 font-black uppercase tracking-widest text-[10px] mb-3">
                            <Bike size={18} /> Delivering Luxe Taste
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none mb-4">Luxe Food</h1>
                        <div className="flex items-center gap-2 text-gray-500 font-bold">
                            <MapPin size={16} className="text-blue-500" />
                            <span className="text-sm">New York, Central Park W</span>
                            <span className="text-blue-500 cursor-pointer hover:underline text-[10px] ml-2 font-black uppercase tracking-widest">Change</span>
                        </div>
                    </div>

                    <div className="relative w-full md:w-96">
                        <input
                            type="text"
                            placeholder="Search restaurants or dishes..."
                            className="w-full bg-white/5 border border-white/5 rounded-[32px] py-5 pl-14 pr-6 font-bold text-white focus:ring-2 focus:ring-blue-500/50 transition-all shadow-xl placeholder-gray-600"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
                    </div>
                </div>

                {/* Categories */}
                <div className="flex gap-4 overflow-x-auto pb-8 custom-scrollbar mb-12">
                    {categories.map((cat) => (
                        <button
                            key={cat.name}
                            onClick={() => setSelectedCategory(cat.name)}
                            className={`flex items-center gap-3 px-8 py-5 rounded-[40px] transition-all whitespace-nowrap border ${selectedCategory === cat.name ? 'bg-white text-black border-white shadow-2xl scale-105' : 'bg-white/5 text-gray-500 border-white/5 hover:bg-white/10'}`}
                        >
                            <div className={`p-2 rounded-xl ${selectedCategory === cat.name ? 'bg-black/10' : 'bg-white/10 text-white'}`}>
                                <cat.icon size={20} />
                            </div>
                            <span className="font-black uppercase tracking-widest text-[10px]">{cat.name}</span>
                        </button>
                    ))}
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Restaurants List */}
                    <div className="lg:w-2/3 space-y-12">
                        <div className="flex items-end justify-between px-2">
                            <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Popular Near You</h3>
                            <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest cursor-pointer hover:underline">View All</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {restaurants.map((res) => (
                                <motion.div
                                    key={res.id}
                                    whileHover={{ y: -10 }}
                                    className="bg-white/5 rounded-[60px] shadow-3xl border border-white/10 overflow-hidden group transition-all duration-500 backdrop-blur-3xl"
                                >
                                    <div className="relative h-64">
                                        <img src={res.img} alt={res.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100" />
                                        {res.isPromoted && (
                                            <div className="absolute top-6 left-6 bg-orange-600 text-white font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-widest shadow-xl">
                                                Promoted
                                            </div>
                                        )}
                                        <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2 shadow-xl ring-1 ring-white/10">
                                            <Star size={14} className="text-orange-500 fill-orange-500" />
                                            <span className="text-sm font-black text-white">{res.rating}</span>
                                        </div>
                                    </div>

                                    <div className="p-10">
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <h4 className="text-3xl font-black text-white uppercase tracking-tighter mb-1">{res.name}</h4>
                                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">{res.tag}</p>
                                            </div>
                                            <div className="flex items-center gap-2 text-white font-black bg-white/5 px-4 py-2 rounded-2xl text-[10px] uppercase tracking-widest border border-white/5">
                                                <Clock size={14} className="text-blue-500" /> {res.time}
                                            </div>
                                        </div>

                                        <div className="pt-8 border-t border-white/5 space-y-4">
                                            <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] ml-2">Recommended Menu</p>
                                            {res.menu.map((item) => (
                                                <div key={item.id} className="flex items-center justify-between p-4 bg-white/5 rounded-3xl hover:bg-white/10 transition-colors group/item border border-white/5">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                                                            <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-[11px] text-white uppercase tracking-wider truncate max-w-[150px]">{item.name}</p>
                                                            <p className="text-xs font-black text-blue-500">${item.price}</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => addToCart(item, res.name)}
                                                        className="w-10 h-10 bg-white text-black rounded-xl shadow-2xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all transform active:scale-90"
                                                    >
                                                        <Plus size={18} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Food Cart */}
                    <div className="lg:w-1/3">
                        <div className="bg-white/5 p-10 rounded-[60px] shadow-3xl border border-white/10 sticky top-32 overflow-hidden backdrop-blur-3xl">
                            <div className="flex items-center justify-between mb-10">
                                <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Basket</h3>
                                <ShoppingBag className="text-gray-600" size={24} />
                            </div>

                            <AnimatePresence mode="wait">
                                {cart.length === 0 ? (
                                    <motion.div
                                        key="empty"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-center py-16"
                                    >
                                        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 text-gray-700 border border-white/5 shadow-inner">
                                            <Utensils size={40} />
                                        </div>
                                        <p className="font-black text-gray-600 text-[10px] uppercase tracking-[0.4em]">Basket is currently void</p>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="full"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="space-y-8"
                                    >
                                        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar-dark text-left">
                                            {cart.map((item) => (
                                                <div key={item.id} className="flex items-center gap-4 bg-white/5 p-4 rounded-3xl border border-white/5 group">
                                                    <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 shadow-2xl ring-1 ring-white/10">
                                                        <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-black text-white text-[10px] uppercase tracking-tighter truncate leading-tight">{item.name}</p>
                                                        <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mt-1 mb-2 line-clamp-1">{item.restaurantName}</p>
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3 bg-white/10 px-3 py-1 rounded-full shadow-inner">
                                                                <button onClick={() => updateQuantity(item.id, -1)} className="text-gray-400 hover:text-white transition-colors"><Minus size={10} /></button>
                                                                <span className="text-[10px] font-black text-white">{item.quantity}</span>
                                                                <button onClick={() => updateQuantity(item.id, 1)} className="text-gray-400 hover:text-white transition-colors"><Plus size={10} /></button>
                                                            </div>
                                                            <span className="font-black text-xs text-blue-500">${(item.price * item.quantity).toFixed(2)}</span>
                                                        </div>
                                                    </div>
                                                    <button onClick={() => removeFromCart(item.id)} className="text-gray-600 hover:text-red-500 transition-colors p-1">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="pt-6 border-t border-white/10 space-y-4">
                                            <div className="flex justify-between text-[10px] font-black text-gray-600 uppercase tracking-[0.3em]">
                                                <span>Subtotal</span>
                                                <span className="text-white">${total.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between text-[10px] font-black text-gray-600 uppercase tracking-[0.3em]">
                                                <span>Delivery fee</span>
                                                <span className="text-green-500">EXEMPTED</span>
                                            </div>
                                            <div className="flex justify-between items-end pt-6 border-t border-dashed border-white/10">
                                                <span className="text-xl font-black text-white uppercase tracking-tighter">Manifest Total</span>
                                                <span className="text-3xl font-black text-blue-500 tracking-tighter">${(total + (isUrgent ? 5 : 0)).toFixed(2)}</span>
                                            </div>

                                            {/* Urgent Delivery Option */}
                                            <div className="bg-blue-600/10 p-5 rounded-3xl border border-blue-500/20 mt-8 group cursor-pointer hover:bg-blue-600/20 transition-colors" onClick={() => setIsUrgent(!isUrgent)}>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`p-2.5 rounded-xl transition-all ${isUrgent ? 'bg-blue-600 text-white shadow-lg' : 'bg-white/5 text-blue-500'}`}>
                                                            <Zap size={18} />
                                                        </div>
                                                        <div className="text-left">
                                                            <p className="text-[10px] font-black text-white uppercase tracking-widest">Sonic Dispatch</p>
                                                            <p className="text-[8px] font-black text-blue-500 uppercase tracking-widest mt-1">Express 15 Min • +$5.00</p>
                                                        </div>
                                                    </div>
                                                    <div className={`w-10 h-5 rounded-full transition-all relative ring-1 ring-white/10 ${isUrgent ? 'bg-blue-600' : 'bg-white/5'}`}>
                                                        <motion.div
                                                            animate={{ x: isUrgent ? 20 : 0 }}
                                                            className="absolute top-1 left-1 w-3 h-3 bg-white rounded-full shadow-md"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                onClick={handleCheckout}
                                                disabled={isCheckout}
                                                className="w-full bg-white text-black py-6 rounded-[32px] font-black uppercase tracking-[0.3em] text-xs mt-8 hover:bg-blue-600 hover:text-white transition-all shadow-3xl flex items-center justify-center gap-4 disabled:opacity-50 active:scale-95"
                                            >
                                                {isCheckout ? "Authorizing..." : "Execute Order"} <Bike size={20} />
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Trust Badge */}
                            <div className="mt-10 flex items-center justify-center gap-8 opacity-20 hover:opacity-50 transition-opacity">
                                <ShieldCheck size={28} className="text-white" />
                                <Award size={28} className="text-white" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Checkout Modal */}
            <AnimatePresence>
                {isCheckout && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[150] flex items-center justify-center p-4"
                    >
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
                        <motion.div
                            initial={{ scale: 0.9, y: 30 }}
                            animate={{ scale: 1, y: 0 }}
                            className="relative bg-black/90 w-full max-w-lg rounded-[64px] p-16 text-center shadow-3xl border border-white/10 backdrop-blur-3xl"
                        >
                            {!orderDone ? (
                                <div className="space-y-10">
                                    <div className="w-28 h-28 bg-white/5 text-blue-500 rounded-full flex items-center justify-center mx-auto animate-pulse border border-white/5 shadow-inner">
                                        <Bike size={56} />
                                    </div>
                                    <h3 className="text-4xl font-black text-white uppercase tracking-tighter">Establishing Link...</h3>
                                    <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Syncing order parameters with restaurant node</p>
                                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
                                        <motion.div
                                            initial={{ width: '0%' }}
                                            animate={{ width: '100%' }}
                                            transition={{ duration: 3 }}
                                            className="h-full bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.5)]"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="space-y-10"
                                >
                                    <div className="relative">
                                        {/* Simulated Map Background */}
                                        <div className="w-full h-56 bg-black/40 rounded-[40px] overflow-hidden relative mb-10 border border-white/5 shadow-inner backdrop-blur-md">
                                            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

                                            {/* Simulated Route */}
                                            <svg className="absolute inset-0 w-full h-full text-blue-500/20" preserveAspectRatio="none">
                                                <motion.path
                                                    d="M 50 180 Q 150 50 350 120"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="6"
                                                    strokeDasharray="10 10"
                                                />
                                            </svg>

                                            {/* Restaurant Marker */}
                                            <div className="absolute top-[160px] left-[40px] text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                                                <Utensils size={28} />
                                            </div>

                                            {/* Destination Marker */}
                                            <div className="absolute top-[100px] right-[40px] text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.6)] scale-125">
                                                <MapPin size={28} />
                                            </div>

                                            {/* Moving Courier */}
                                            <motion.div
                                                animate={{
                                                    x: [0, 310],
                                                    y: [0, -60],
                                                    opacity: [0, 1, 1, 0]
                                                }}
                                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                                className="absolute top-[170px] left-[50px] text-white z-10"
                                            >
                                                <Bike size={24} />
                                            </motion.div>
                                        </div>

                                        <div className="w-24 h-24 bg-black/60 text-green-500 rounded-full flex items-center justify-center mx-auto absolute -top-24 left-1/2 -translate-x-1/2 border-4 border-white/10 shadow-3xl backdrop-blur-xl">
                                            <CheckCircle2 size={56} />
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <h3 className="text-4xl font-black text-white uppercase tracking-tighter">Cipher Accepted</h3>
                                        <p className="text-gray-500 font-black leading-relaxed mt-4 uppercase tracking-[0.4em] text-[10px]">Logistics in progress • arrival in 25 min</p>
                                    </div>

                                    <div className="bg-white/5 p-6 rounded-[32px] text-left flex items-center gap-6 border border-white/5 backdrop-blur-md">
                                        <div className="w-14 h-14 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
                                            <Award size={28} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-white uppercase tracking-widest text-shadow">50 LUXE UNITS EARNED</p>
                                            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider mt-1">Available for next procurement</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setIsCheckout(false)}
                                        className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-600 hover:text-white transition-all shadow-3xl scale-105"
                                    >
                                        Track Trajectory
                                    </button>
                                </motion.div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
