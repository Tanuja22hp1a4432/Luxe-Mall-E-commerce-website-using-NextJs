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
    const fileInputRef = useRef(null);

    useEffect(() => {
        // Load existing reviews from localStorage
        const savedReviews = localStorage.getItem(`reviews_${productId}`);
        if (savedReviews) {
            setReviews(JSON.parse(savedReviews));
        }
    }, [productId]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
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
            };

            const updatedReviews = [newReview, ...reviews];
            setReviews(updatedReviews);
            localStorage.setItem(`reviews_${productId}`, JSON.stringify(updatedReviews));
            
            setIsSubmitting(false);
            setShowForm(false);
            setRating(5);
            setComment("");
            setPreview(null);
            toast.success("Review submitted! Thank you.");
        }, 1500);
    };

    return (
        <div className="py-24 border-t border-gray-100 mt-12 overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                <div>
                    <h2 className="text-4xl font-black mb-4 uppercase tracking-tighter">Customer Reviews</h2>
                    <div className="flex items-center gap-4">
                        <div className="flex text-yellow-400">
                            {[1,2,3,4,5].map(i => <Star key={i} size={20} fill={i <= 4.9 ? "currentColor" : "none"} />)}
                        </div>
                        <span className="text-lg font-black text-gray-900">4.9 out of 5</span>
                        <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Based on {128 + reviews.length} reviews</span>
                    </div>
                </div>
                <button 
                    onClick={() => setShowForm(!showForm)}
                    className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-black transition-all shadow-xl shadow-gray-200"
                >
                    {showForm ? "Cancel Review" : "Write a Review"}
                </button>
            </div>

            <AnimatePresence>
                {showForm && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-20 bg-gray-50 p-10 rounded-[40px] border border-gray-100 shadow-inner"
                    >
                        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-8">
                            <div className="text-center">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 text-center">Your Rating</p>
                                <div className="flex justify-center gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button 
                                            key={star} 
                                            type="button" 
                                            onClick={() => setRating(star)}
                                            className="transition-transform hover:scale-125"
                                        >
                                            <Star 
                                                size={40} 
                                                className={star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'} 
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4 text-left">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Photo Review (Optional)</label>
                                <div 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-gray-200 rounded-3xl p-8 text-center cursor-pointer hover:bg-white hover:border-blue-400 transition-all group"
                                >
                                    {preview ? (
                                        <div className="relative inline-block">
                                            <img src={preview} alt="Review Preview" className="h-32 w-32 object-cover rounded-2xl shadow-lg" />
                                            <button 
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); setPreview(null); }}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-md"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center">
                                            <Camera size={32} className="text-gray-300 group-hover:text-blue-500 transition-colors mb-2" />
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Click to upload photo</p>
                                        </div>
                                    )}
                                    <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileChange} />
                                </div>
                            </div>

                            <div className="space-y-4 text-left">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Your Feedback</label>
                                <textarea 
                                    required
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    className="w-full bg-white border-2 border-transparent rounded-[32px] px-8 py-6 focus:ring-0 focus:border-blue-500 outline-none font-medium text-gray-700 transition-all min-h-[160px] shadow-sm"
                                    placeholder="Tell others what you loved about this product..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-gray-900 text-white py-5 rounded-3xl font-black uppercase tracking-[0.2em] text-xs shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {isSubmitting ? "Uploading..." : "Publish Review"} <CheckCircle2 size={18} />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Default Simulated Reviews */}
                <div className="bg-gray-50/50 p-10 rounded-[40px] border border-gray-100 flex flex-col h-full">
                    <div className="flex justify-between mb-6">
                        <div className="flex text-yellow-400">
                            {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                        </div>
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">May 12, 2026</span>
                    </div>
                    <p className="text-gray-700 font-medium mb-8 italic leading-relaxed text-sm">"Absolutely stunning! The quality is even better than what I expected. Fast shipping and premium packaging."</p>
                    <div className="mt-auto flex items-center gap-4 border-t border-gray-100/50 pt-6">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-black text-xs">SJ</div>
                        <p className="text-xs font-black text-gray-900 uppercase tracking-widest">Sarah J. <span className="text-[10px] text-green-500 ml-2">Verified</span></p>
                    </div>
                </div>

                <div className="bg-gray-50/50 p-10 rounded-[40px] border border-gray-100 flex flex-col h-full">
                    <div className="flex justify-between mb-6">
                        <div className="flex text-yellow-400">
                            {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                        </div>
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">April 28, 2026</span>
                    </div>
                    <p className="text-gray-700 font-medium mb-8 italic leading-relaxed text-sm">"Loved it. Fits perfectly and looks very elegant. Will definitely buy more from LuxeStore."</p>
                    <div className="mt-auto flex items-center gap-4 border-t border-gray-100/50 pt-6">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-black text-xs">MK</div>
                        <p className="text-xs font-black text-gray-900 uppercase tracking-widest">Michael K. <span className="text-[10px] text-green-500 ml-2">Verified</span></p>
                    </div>
                </div>

                {reviews.map((rev) => (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        key={rev.id} 
                        className="bg-blue-50/30 p-10 rounded-[40px] border border-blue-100 flex flex-col h-full shadow-sm"
                    >
                        <div className="flex justify-between mb-6">
                            <div className="flex text-yellow-400">
                                {[...Array(rev.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                            </div>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{rev.date}</span>
                        </div>
                        
                        {rev.image && (
                            <div className="mb-6 rounded-3xl overflow-hidden shadow-lg border-4 border-white h-48">
                                <img src={rev.image} alt="User Review" className="w-full h-full object-cover" />
                            </div>
                        )}
                        
                        <p className="text-gray-700 font-medium mb-8 italic leading-relaxed text-sm">"{rev.comment}"</p>
                        
                        <div className="mt-auto flex items-center gap-4 border-t border-blue-100 pt-6">
                            <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white font-black text-xs">VB</div>
                            <p className="text-xs font-black text-gray-900 uppercase tracking-widest">{rev.name} <span className="text-[10px] text-blue-600 ml-2">NEW</span></p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default ReviewSystem;
