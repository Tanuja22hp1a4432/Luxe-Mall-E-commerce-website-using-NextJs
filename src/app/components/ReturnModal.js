'use client';

import { useState } from 'react';
import { X, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const reasons = [
    "Wong size / Fit issues",
    "Defective / Damaged product",
    "Product not as described",
    "Quality not up to expectations",
    "Changed my mind",
    "Other"
];

const ReturnModal = ({ isOpen, onClose, orderId, onReturnSubmit }) => {
    const [reason, setReason] = useState("");
    const [note, setNote] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        onReturnSubmit(orderId, reason, note);
        setSubmitted(true);
        setTimeout(() => {
            onClose();
            setSubmitted(false);
            setReason("");
            setNote("");
        }, 3000);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
                    onClick={onClose} 
                />
                
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden"
                >
                    <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <div>
                            <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Return Order</h3>
                            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Order ID: {orderId}</p>
                        </div>
                        <button onClick={onClose} className="p-3 bg-white rounded-full text-gray-400 hover:text-gray-900 shadow-sm transition-colors ring-1 ring-gray-100">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="p-10">
                        {!submitted ? (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-4 text-left">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Select Reason</label>
                                    <div className="grid grid-cols-1 gap-3">
                                        {reasons.map((r) => (
                                            <button
                                                key={r}
                                                type="button"
                                                onClick={() => setReason(r)}
                                                className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all text-left ${reason === r ? 'border-blue-600 bg-blue-50/50' : 'border-gray-50 bg-gray-50 hover:bg-gray-100'}`}
                                            >
                                                <span className={`font-bold text-sm ${reason === r ? 'text-gray-900' : 'text-gray-500'}`}>{r}</span>
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${reason === r ? 'border-blue-600' : 'border-gray-200'}`}>
                                                    {reason === r && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4 text-left">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Additional Details (Optional)</label>
                                    <textarea 
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-blue-600 outline-none font-bold text-gray-900 transition-all min-h-[120px]"
                                        placeholder="Tell us more about the issue..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={!reason}
                                    className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm mt-4 hover:bg-black transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-3"
                                >
                                    Submit Return Request <RefreshCw size={20} />
                                </button>
                            </form>
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-10"
                            >
                                <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-100">
                                    <CheckCircle2 size={40} />
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter mb-3">Request Received!</h3>
                                <p className="text-gray-500 font-medium leading-relaxed">Your return request for <span className="font-bold text-gray-900">{orderId}</span> has been submitted. Our team will review it within 24-48 hours.</p>
                            </motion.div>
                        )}
                    </div>

                    <div className="bg-blue-50 p-6 flex items-start gap-4 mx-6 mb-6 rounded-3xl border border-blue-100">
                        <AlertCircle className="text-blue-600 flex-shrink-0" size={20} />
                        <p className="text-[10px] text-blue-700 font-black uppercase tracking-wider leading-relaxed text-left">
                            Our standard return policy allows returns within 30 days of delivery. Make sure all items are in their original packaging with tags.
                        </p>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ReturnModal;
