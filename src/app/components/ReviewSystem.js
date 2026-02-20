'use client';

import { useState, useEffect, useRef } from 'react';
import { Star, Camera, Upload, CheckCircle2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const ReviewSystem = ({ productId }) => {
    const [reviews, setReviews] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [preview, setPreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [sortBy, setSortBy] = useState("recent");
    const [filterRating, setFilterRating] = useState(0);
    const fileInputRef = useRef(null);

    // Initial mock reviews to combine with local storage
    const baseMockReviews = [
        { id: 1, name: "Sarah J.", date: "May 12, 2026", rating: 5, comment: "Absolutely stunning! The quality is even better than what I expected. Fast shipping and premium packaging.", initials: "SJ", color: "blue", helpful: 12 },
        { id: 2, name: "Michael K.", date: "April 28, 2026", rating: 4, comment: "Loved it. Fits perfectly and looks very elegant. Will definitely buy more from LuxeStore.", initials: "MK", color: "purple", helpful: 8 }
    ];

    useEffect(() => {
        const savedReviews = localStorage.getItem(`reviews_${productId}`);
        const userReviews = savedReviews ? JSON.parse(savedReviews) : [];
        setReviews([...userReviews, ...baseMockReviews]);
    }, [productId]);

    const handleHelpful = (id) => {
        setReviews(prev => prev.map(r => r.id === id ? { ...r, helpful: (r.helpful || 0) + 1 } : r));
        toast.success("Thanks for your feedback!");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        setTimeout(() => {
            const newReview = {
                id: Date.now(),
                name: "Verified Buyer",
                date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
                rating,
                comment,
                image: preview,
                initials: "VB",
                color: "gray",
                helpful: 0,
                isNew: true
            };

            const updatedUserReviews = [newReview, ...(localStorage.getItem(`reviews_${productId}`) ? JSON.parse(localStorage.getItem(`reviews_${productId}`)) : [])];
            localStorage.setItem(`reviews_${productId}`, JSON.stringify(updatedUserReviews));
            setReviews(prev => [newReview, ...prev]);
            
            setIsSubmitting(false);
            setShowForm(false);
            setRating(5);
            setComment("");
            setPreview(null);
            toast.success("Review submitted! Thank you.");
        }, 1500);
    };

    const processedReviews = reviews
        .filter(r => filterRating === 0 || r.rating === filterRating)
        .sort((a, b) => {
            if (sortBy === "recent") return new Date(b.date) - new Date(a.date);
            if (sortBy === "rating") return b.rating - a.rating;
            return 0;
        });

    const avgRating = (reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1)).toFixed(1);

    return (
        <div className="py-24 border-t border-white/5 mt-12 overflow-hidden bg-black/20 backdrop-blur-3xl rounded-[60px] p-12 shadow-2xl">
            <div className="flex flex-col md:flex-row justify-between items-start mb-16 gap-12">
                <div>
                    <h2 className="text-5xl font-black mb-6 uppercase tracking-tighter text-white">Public Reviews</h2>
                    <div className="flex flex-wrap items-center gap-8">
                        <div className="flex flex-col items-center justify-center bg-white/5 p-6 rounded-[32px] border border-white/10 min-w-[140px]">
                            <span className="text-4xl font-black text-white">{avgRating}</span>
                            <div className="flex text-yellow-400 my-2">
                                {[1,2,3,4,5].map(i => <Star key={i} size={16} fill={i <= Math.round(avgRating) ? "currentColor" : "none"} />)}
                            </div>
                            <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{reviews.length} REVIEWS</span>
                        </div>

                        <div className="flex flex-col gap-4 flex-grow max-w-md">
                            {[5,4,3,2,1].map(star => {
                                const count = reviews.filter(r => r.rating === star).length;
                                const percent = (count / (reviews.length || 1)) * 100;
                                return (
                                    <div key={star} className="flex items-center gap-4 cursor-pointer group" onClick={() => setFilterRating(filterRating === star ? 0 : star)}>
                                        <span className="text-[10px] font-black text-gray-400 w-4">{star}★</span>
                                        <div className="flex-grow h-1.5 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${percent}%` }}
                                                className={`h-full ${filterRating === star ? 'bg-blue-500' : 'bg-gray-600 group-hover:bg-blue-400'} transition-colors`}
                                            />
                                        </div>
                                        <span className="text-[10px] font-black text-gray-500 w-8 text-right">{count}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
                
                <div className="flex flex-col gap-4 w-full md:w-auto">
                    <button 
                        onClick={() => setShowForm(!showForm)}
                        className="bg-blue-600 text-white px-10 py-5 rounded-[24px] font-black uppercase tracking-[0.2em] text-[10px] hover:bg-blue-500 transition-all shadow-[0_20px_40px_rgba(37,99,235,0.3)] glow-btn"
                    >
                        {showForm ? "Cancel Review" : "Write a Review"}
                    </button>
                    
                    <div className="flex gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xl">
                        {['recent', 'rating'].map((sort) => (
                            <button
                                key={sort}
                                onClick={() => setSortBy(sort)}
                                className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${sortBy === sort ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
                            >
                                {sort}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {showForm && (
                    <motion.div 
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.95 }}
                        className="mb-20 bg-white/5 p-12 rounded-[48px] border border-white/10 shadow-2xl relative z-10"
                    >
                        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-10">
                            <div className="text-center">
                                <p className="text-[11px] font-black uppercase tracking-[0.3em] text-blue-500 mb-6">RATE YOUR EXPERIENCE</p>
                                <div className="flex justify-center gap-4">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button 
                                            key={star} 
                                            type="button" 
                                            onClick={() => setRating(star)}
                                            className="transition-transform hover:scale-125"
                                        >
                                            <Star 
                                                size={48} 
                                                className={star <= rating ? 'text-yellow-400 fill-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]' : 'text-white/10'} 
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-2">Visual Proof</label>
                                <div 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-white/10 rounded-[32px] p-12 text-center cursor-pointer hover:bg-white/5 hover:border-blue-500/50 transition-all group overflow-hidden relative"
                                >
                                    {preview ? (
                                        <div className="relative inline-block">
                                            <img src={preview} alt="Review Preview" className="h-40 w-full object-cover rounded-3xl" />
                                            <button 
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); setPreview(null); }}
                                                className="absolute -top-3 -right-3 bg-red-500 text-white p-2 rounded-full shadow-2xl"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center">
                                            <Camera size={40} className="text-white/10 group-hover:text-blue-500 transition-colors mb-4" />
                                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Share a photo of your product</p>
                                        </div>
                                    )}
                                    <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileChange} />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-2">Your Story</label>
                                <textarea 
                                    required
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-[40px] px-10 py-8 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 focus:bg-white/10 outline-none font-medium text-white transition-all min-h-[220px] shadow-inner text-lg placeholder:text-gray-700"
                                    placeholder="The fit, the feel, the vibe..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-white text-black py-6 rounded-[30px] font-black uppercase tracking-[0.3em] text-xs shadow-2xl hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center gap-4 disabled:opacity-50 group grow-btn"
                            >
                                {isSubmitting ? "PROCESSING..." : "PUBLISH WORLDWIDE"} <CheckCircle2 size={24} className="group-hover:rotate-[360deg] transition-transform duration-1000" />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {processedReviews.map((rev) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        key={rev.id} 
                        className={`p-10 rounded-[50px] border flex flex-col h-full shadow-2xl transition-all hover:translate-y-[-10px] ${rev.isNew ? 'bg-blue-600/10 border-blue-500/20 shadow-blue-500/5' : 'bg-white/5 border-white/5 hover:border-white/10'}`}
                    >
                        <div className="flex justify-between items-center mb-8">
                            <div className="flex text-yellow-400 gap-1">
                                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < rev.rating ? "currentColor" : "none"} className={i < rev.rating ? "" : "text-white/10"} />)}
                            </div>
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{rev.date}</span>
                        </div>
                        
                        {rev.image && (
                            <div className="mb-8 rounded-[32px] overflow-hidden shadow-2xl h-56 group relative">
                                <img src={rev.image} alt="User Review" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        )}
                        
                        <p className="text-gray-300 font-medium mb-10 leading-relaxed text-lg tracking-tight">"{rev.comment}"</p>
                        
                        <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-8">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-xs ring-4 ring-offset-4 ring-offset-black transition-all ${rev.color === 'blue' ? 'bg-blue-600 ring-blue-600/20' : rev.color === 'purple' ? 'bg-purple-600 ring-purple-600/20' : 'bg-gray-800 ring-gray-800/20'}`}>
                                    {rev.initials}
                                </div>
                                <div>
                                    <p className="text-xs font-black text-white uppercase tracking-widest">{rev.name}</p>
                                    <span className="text-[9px] text-blue-500 font-black uppercase tracking-[0.2em]">VERIFIED BUYER</span>
                                </div>
                            </div>
                            
                            <button 
                                onClick={() => handleHelpful(rev.id)}
                                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-all group"
                            >
                                <motion.span whileTap={{ scale: 1.5 }} className="text-xs group-hover:scale-125 transition-transform">👍</motion.span>
                                <span className="text-[10px] text-gray-400 font-bold">{rev.helpful || 0}</span>
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
            
            {processedReviews.length === 0 && (
                <div className="text-center py-20 bg-white/5 rounded-[40px] border border-white/5 border-dashed">
                    <p className="text-gray-500 font-black uppercase tracking-widest text-xs">No reviews matching your filter</p>
                </div>
            )}
        </div>
    );
};

export default ReviewSystem;
