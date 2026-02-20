'use client';

import { useState } from 'react';
import { 
    Search, MapPin, Star, Clock, Utensils, 
    Pizza, Burger, Soup, Coffee, ArrowRight,
    ShoppingBag, Trash2, Plus, Minus, CheckCircle2,
    Bike, Award, ShieldCheck, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const categories = [
    { name: 'Pizza', icon: Pizza, color: 'bg-red-50 text-red-600' },
    { name: 'Burgers', icon: Burger, color: 'bg-orange-50 text-orange-600' },
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
        <div className="bg-white min-h-screen pt-32 pb-20">
            <div className="container mx-auto px-4">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
                    <div className="text-left w-full md:w-auto">
                        <div className="flex items-center gap-2 text-orange-600 font-black uppercase tracking-widest text-xs mb-3">
                            <Bike size={18} /> Delivering Luxe Taste
                        </div>
                        <h1 className="text-5xl font-black text-gray-900 uppercase tracking-tighter leading-none mb-4">Luxe Food</h1>
                        <div className="flex items-center gap-2 text-gray-400 font-bold">
                            <MapPin size={16} className="text-blue-600" /> 
                            <span className="text-sm">New York, Central Park W</span>
                            <span className="text-blue-600 cursor-pointer hover:underline text-xs ml-2">Change</span>
                        </div>
                    </div>
                    
                    <div className="relative w-full md:w-96">
                        <input 
                            type="text" 
                            placeholder="Search restaurants or dishes..." 
                            className="w-full bg-gray-50 border-none rounded-3xl py-5 pl-14 pr-6 font-bold text-gray-900 focus:ring-2 focus:ring-orange-100 transition-all shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    </div>
                </div>

                {/* Categories */}
                <div className="flex gap-4 overflow-x-auto pb-8 custom-scrollbar mb-12">
                    {categories.map((cat) => (
                        <button 
                            key={cat.name}
                            onClick={() => setSelectedCategory(cat.name)}
                            className={`flex items-center gap-3 px-8 py-5 rounded-[32px] transition-all whitespace-nowrap ${selectedCategory === cat.name ? 'bg-gray-900 text-white shadow-2xl scale-105' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                        >
                            <div className={`p-2 rounded-xl ${selectedCategory === cat.name ? 'bg-white/20' : cat.color}`}>
                                <cat.icon size={20} />
                            </div>
                            <span className="font-black uppercase tracking-widest text-xs">{cat.name}</span>
                        </button>
                    ))}
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Restaurants List */}
                    <div className="lg:w-2/3 space-y-12">
                        <div className="flex items-end justify-between px-2">
                             <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Popular Near You</h3>
                             <p className="text-xs text-blue-600 font-black uppercase tracking-widest cursor-pointer hover:underline">View All</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {restaurants.map((res) => (
                                <motion.div 
                                    key={res.id}
                                    whileHover={{ y: -10 }}
                                    className="bg-white rounded-[48px] shadow-2xl shadow-gray-100 border border-gray-100 overflow-hidden group transition-all duration-500"
                                >
                                    <div className="relative h-64">
                                        <img src={res.img} alt={res.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        {res.isPromoted && (
                                            <div className="absolute top-6 left-6 bg-orange-600 text-white font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-widest shadow-xl">
                                                Promoted
                                            </div>
                                        )}
                                        <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2 shadow-xl ring-1 ring-black/5">
                                            <Star size={14} className="text-orange-500 fill-orange-500" />
                                            <span className="text-sm font-black text-gray-900">{res.rating}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="p-10">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h4 className="text-2xl font-black text-gray-900 uppercase tracking-tighter mb-1">{res.name}</h4>
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{res.tag}</p>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-900 font-bold bg-gray-50 px-4 py-2 rounded-2xl text-xs">
                                                <Clock size={14} className="text-blue-600" /> {res.time}
                                            </div>
                                        </div>
                                        
                                        <div className="pt-8 border-t border-gray-50 space-y-4">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Recommended Menu</p>
                                            {res.menu.map((item) => (
                                                <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-3xl hover:bg-orange-50 transition-colors group/item">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm">
                                                            <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-sm text-gray-900 truncate max-w-[150px]">{item.name}</p>
                                                            <p className="text-xs font-black text-blue-600">${item.price}</p>
                                                        </div>
                                                    </div>
                                                    <button 
                                                        onClick={() => addToCart(item, res.name)}
                                                        className="w-10 h-10 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-900 hover:text-white hover:border-black transition-all"
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
                        <div className="bg-white p-10 rounded-[48px] shadow-2xl shadow-gray-200 border border-gray-100 sticky top-32 overflow-hidden">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">My Basket</h3>
                                <ShoppingBag className="text-gray-300" size={24} />
                            </div>

                            <AnimatePresence mode="wait">
                                {cart.length === 0 ? (
                                    <motion.div 
                                        key="empty"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-center py-12"
                                    >
                                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                                            <Utensils size={32} />
                                        </div>
                                        <p className="font-bold text-gray-400 text-sm uppercase tracking-widest">Basket is empty</p>
                                    </motion.div>
                                ) : (
                                    <motion.div 
                                        key="full"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="space-y-6"
                                    >
                                        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                            {cart.map((item) => (
                                                <div key={item.id} className="flex items-center gap-4 bg-gray-50/50 p-4 rounded-3xl border border-gray-50">
                                                    <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0">
                                                        <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-black text-gray-900 text-xs uppercase tracking-tighter truncate leading-tight">{item.name}</p>
                                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 mb-2 line-clamp-1">{item.restaurantName}</p>
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3 bg-white px-3 py-1 rounded-full shadow-sm ring-1 ring-black/5">
                                                                <button onClick={() => updateQuantity(item.id, -1)} className="text-gray-400 hover:text-gray-900"><Minus size={12} /></button>
                                                                <span className="text-xs font-black text-gray-900">{item.quantity}</span>
                                                                <button onClick={() => updateQuantity(item.id, 1)} className="text-gray-400 hover:text-gray-900"><Plus size={12} /></button>
                                                            </div>
                                                            <span className="font-black text-sm text-blue-600">${(item.price * item.quantity).toFixed(2)}</span>
                                                        </div>
                                                    </div>
                                                    <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500 transition-colors p-1">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="pt-6 border-t border-gray-100 space-y-4">
                                            <div className="flex justify-between text-xs font-black text-gray-400 uppercase tracking-widest">
                                                <span>Subtotal</span>
                                                <span className="text-gray-900">${total.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between text-xs font-black text-gray-400 uppercase tracking-widest">
                                                <span>Delivery fee</span>
                                                <span className="text-green-600">FREE</span>
                                            </div>
                                            <div className="flex justify-between items-end pt-4 border-t-2 border-dashed border-gray-100">
                                                <span className="text-xl font-black text-gray-900 uppercase tracking-tighter">Total Price</span>
                                                <span className="text-3xl font-black text-orange-600">${(total + (isUrgent ? 5 : 0)).toFixed(2)}</span>
                                            </div>

                                            {/* Urgent Delivery Option */}
                                            <div className="bg-orange-50 p-4 rounded-3xl border border-orange-100 mt-6 group cursor-pointer" onClick={() => setIsUrgent(!isUrgent)}>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-2 rounded-xl transition-colors ${isUrgent ? 'bg-orange-600 text-white' : 'bg-white text-orange-600'}`}>
                                                            <Zap size={16} />
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Urgent Delivery</p>
                                                            <p className="text-[8px] font-bold text-orange-600 uppercase tracking-tight">Express 10-15 Min • +$5.00</p>
                                                        </div>
                                                    </div>
                                                    <div className={`w-10 h-5 rounded-full transition-colors relative ${isUrgent ? 'bg-orange-600' : 'bg-gray-200'}`}>
                                                        <motion.div 
                                                            animate={{ x: isUrgent ? 20 : 0 }}
                                                            className="absolute top-1 left-1 w-3 h-3 bg-white rounded-full shadow-sm"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <button 
                                                onClick={handleCheckout}
                                                disabled={isCheckout}
                                                className="w-full bg-gray-900 text-white py-5 rounded-3xl font-black uppercase tracking-[0.2em] text-xs mt-6 hover:bg-black transition-all shadow-xl shadow-orange-100 flex items-center justify-center gap-3 disabled:opacity-70"
                                            >
                                                {isCheckout ? "Processing..." : "Place Order"} <Bike size={18} />
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Trust Badge */}
                            <div className="mt-8 flex items-center justify-center gap-6 opacity-40">
                                <ShieldCheck size={24} />
                                <Award size={24} />
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
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="relative bg-white w-full max-w-md rounded-[48px] p-12 text-center shadow-2xl"
                        >
                            {!orderDone ? (
                                <div className="space-y-8">
                                    <div className="w-24 h-24 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
                                        <Bike size={48} />
                                    </div>
                                    <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Connecting to Chef...</h3>
                                    <p className="text-gray-500 font-medium">Sit back and relax while we notify the restaurant of your delicious order.</p>
                                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: '0%' }}
                                            animate={{ width: '100%' }}
                                            transition={{ duration: 3 }}
                                            className="h-full bg-orange-600"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="space-y-8"
                                >
                                    <div className="relative">
                                        {/* Simulated Map Background */}
                                        <div className="w-full h-48 bg-gray-100 rounded-[32px] overflow-hidden relative mb-6 border border-gray-100 shadow-inner">
                                            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                                            
                                            {/* Simulated Route */}
                                            <svg className="absolute inset-0 w-full h-full text-blue-100" preserveAspectRatio="none">
                                                <motion.path 
                                                    d="M 50 150 Q 150 50 350 100" 
                                                    fill="none" 
                                                    stroke="currentColor" 
                                                    strokeWidth="4" 
                                                    strokeDasharray="8 8"
                                                />
                                            </svg>
                                            
                                            {/* Restaurant Marker */}
                                            <div className="absolute top-[140px] left-[40px] text-orange-600 drop-shadow-lg">
                                                <Utensils size={24} />
                                            </div>

                                            {/* Destination Marker */}
                                            <div className="absolute top-[90px] right-[40px] text-blue-600 drop-shadow-lg scale-110">
                                                <MapPin size={24} />
                                            </div>

                                            {/* Moving Courier */}
                                            <motion.div 
                                                animate={{ 
                                                    x: [0, 300], 
                                                    y: [0, -50],
                                                    opacity: [0, 1, 1, 0]
                                                }}
                                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                                className="absolute top-[150px] left-[50px] text-gray-900 z-10"
                                            >
                                                <Bike size={20} />
                                            </motion.div>
                                        </div>

                                        <div className="w-24 h-24 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto absolute -top-12 left-1/2 -translate-x-1/2 border-4 border-white shadow-xl">
                                            <CheckCircle2 size={48} />
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Order Success!</h3>
                                        <p className="text-gray-500 font-medium leading-relaxed mt-2 uppercase tracking-widest text-[10px]">Courier is on the way • arriving in 25 min</p>
                                    </div>
                                    
                                    <div className="bg-gray-50 p-6 rounded-3xl text-left flex items-center gap-4 border border-gray-100">
                                        <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                                            <Award size={24} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-gray-900 uppercase tracking-widest">You earned 50 LuxePoints!</p>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase">Redeem on your next fashion order</p>
                                        </div>
                                    </div>

                                    <button 
                                        onClick={() => setIsCheckout(false)}
                                        className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-black transition-all shadow-xl"
                                    >
                                        Track Delivery
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
