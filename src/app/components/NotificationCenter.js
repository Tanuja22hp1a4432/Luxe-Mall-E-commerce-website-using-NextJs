'use client';

import { useState, useEffect } from 'react';
import { Bell, X, Info, Truck, CheckCircle2, Ticket, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationCenter = ({ isOpen, onClose }) => {
    const [notifications, setNotifications] = useState([
        { id: 1, type: 'order', title: 'Order Delivered!', message: 'Your order #ORD-LV99 is now at your doorstep.', time: '2 mins ago', icon: CheckCircle2, color: 'bg-green-50 text-green-600' },
        { id: 2, type: 'promo', title: 'Limited Offer!', message: 'Use code LUXE20 for extra 20% off on all items.', time: '1 hour ago', icon: Ticket, color: 'bg-blue-50 text-blue-600' },
        { id: 3, type: 'shipping', title: 'On the Way', message: 'Your pizza from Luxe Italy is out for delivery.', time: 'Just now', icon: Truck, color: 'bg-orange-50 text-orange-600' }
    ]);

    const removeNotification = (id) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[160] flex items-start justify-end p-4 pointer-events-none">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/10 backdrop-blur-[2px] pointer-events-auto" 
                    onClick={onClose} 
                />
                
                <motion.div 
                    initial={{ opacity: 0, x: 50, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 50, scale: 0.95 }}
                    className="relative bg-white w-full max-w-sm rounded-[40px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.2)] mt-24 mr-4 pointer-events-auto overflow-hidden flex flex-col max-h-[80vh] border border-gray-100"
                >
                    <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-900 rounded-2xl flex items-center justify-center text-white">
                                <Bell size={20} />
                            </div>
                            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Notifications</h3>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="overflow-y-auto p-4 space-y-3 custom-scrollbar">
                        {notifications.length === 0 ? (
                            <div className="py-20 text-center">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                                    <Bell size={32} />
                                </div>
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">All caught up!</p>
                            </div>
                        ) : (
                            notifications.map((n) => (
                                <motion.div 
                                    layout
                                    key={n.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-5 bg-white rounded-3xl border border-gray-100 hover:border-blue-100 transition-all shadow-sm group relative"
                                >
                                    <div className="flex gap-4">
                                        <div className={`w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center ${n.color}`}>
                                            <n.icon size={24} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="font-black text-gray-900 text-sm uppercase tracking-tighter">{n.title}</h4>
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{n.time}</span>
                                            </div>
                                            <p className="text-xs text-gray-500 font-medium leading-relaxed">{n.message}</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => removeNotification(n.id)}
                                        className="absolute top-4 right-4 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <X size={14} />
                                    </button>
                                </motion.div>
                            ))
                        )}
                    </div>

                    {notifications.length > 0 && (
                        <div className="p-6 border-t border-gray-50 text-center">
                            <button 
                                onClick={() => setNotifications([])}
                                className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] hover:text-blue-700 transition-all"
                            >
                                Clear All Notifications
                            </button>
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default NotificationCenter;
