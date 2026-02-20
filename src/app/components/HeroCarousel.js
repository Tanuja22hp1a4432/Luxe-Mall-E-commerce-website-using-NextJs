'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ShoppingBag, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const slides = [
  {
    id: 1,
    title: "FUTURE ADAPTIVE GEAR",
    highlight: "NEON EDITION",
    desc: "Engineered for the urban explorer. 3D-knit technology meets high-performance aesthetics.",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop",
    accent: "text-blue-500",
    gradient: "from-blue-600/20 to-transparent"
  },
  {
    id: 2,
    title: "LUXURY CHRONO HUB",
    highlight: "TIMELESS 2026",
    desc: "Precision craftsmanship redefined. A new era of horological excellence for your wrist.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop",
    accent: "text-purple-500",
    gradient: "from-purple-600/20 to-transparent"
  },
  {
    id: 3,
    title: "QUANTUM AUDIO SPHERE",
    highlight: "ULTRA BASS",
    desc: "Deep spatial soundscapes. Industry-leading noise cancellation in a futuristic carbon shell.",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=2065&auto=format&fit=crop",
    accent: "text-cyan-500",
    gradient: "from-cyan-600/20 to-transparent"
  }
];

const HeroCarousel = () => {
    const [index, setIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    const next = () => {
        setDirection(1);
        setIndex((prev) => (prev + 1) % slides.length);
    };

    const prev = () => {
        setDirection(-1);
        setIndex((prev) => (prev - 1 + slides.length) % slides.length);
    };

    useEffect(() => {
        const timer = setInterval(next, 8000);
        return () => clearInterval(timer);
    }, []);

    const slideVariants = {
        enter: (direction) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0,
            scale: 0.9,
            rotateY: direction > 0 ? 45 : -45
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1,
            rotateY: 0,
            transition: {
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.5 },
                scale: { duration: 0.8 },
                rotateY: { duration: 1 }
            }
        },
        exit: (direction) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0,
            scale: 1.1,
            rotateY: direction < 0 ? 45 : -45,
            transition: { duration: 0.5 }
        })
    };

    const textVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: { delay: 0.3 + (i * 0.1), duration: 0.8, ease: [0.16, 1, 0.3, 1] }
        })
    };

    return (
        <section className="relative h-screen min-h-[700px] w-full bg-black overflow-hidden flex items-center">
            <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                    key={index}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="absolute inset-0 w-full h-full flex items-center justify-center"
                >
                    {/* Background Image with Zoom Effect */}
                    <div className="absolute inset-0 z-0">
                        <motion.img
                            initial={{ scale: 1.2, filter: 'blur(10px) brightness(0.3)' }}
                            animate={{ scale: 1, filter: 'blur(0px) brightness(0.5)' }}
                            transition={{ duration: 1.5 }}
                            src={slides[index].image}
                            alt={slides[index].title}
                            className="w-full h-full object-cover"
                        />
                        <div className={`absolute inset-0 bg-gradient-to-r ${slides[index].gradient} z-1`}></div>
                    </div>

                    {/* Content HUD */}
                    <div className="container mx-auto px-6 md:px-12 relative z-10 grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
                        <div className="flex flex-col items-start pt-20">
                            <motion.div
                                custom={0}
                                variants={textVariants}
                                initial="hidden"
                                animate="visible"
                                className="inline-flex items-center gap-2 mb-6"
                            >
                                <span className={`w-3 h-3 rounded-full bg-current ${slides[index].accent} animate-pulse`}></span>
                                <span className="text-[10px] font-black tracking-[0.4em] text-white/50 uppercase">COLLECTION 2026 / TRENDING</span>
                            </motion.div>

                            <div className="overflow-hidden mb-4">
                                <motion.h1
                                    custom={1}
                                    variants={textVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="text-6xl md:text-8xl font-black text-white leading-none tracking-tighter"
                                >
                                    {slides[index].title}
                                </motion.h1>
                            </div>

                            <motion.h2
                                custom={2}
                                variants={textVariants}
                                initial="hidden"
                                animate="visible"
                                className={`text-4xl md:text-6xl font-black mb-8 italic ${slides[index].accent} drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]`}
                            >
                                {slides[index].highlight}
                            </motion.h2>

                            <motion.p
                                custom={3}
                                variants={textVariants}
                                initial="hidden"
                                animate="visible"
                                className="text-gray-400 text-lg md:text-xl max-w-lg mb-12 leading-relaxed font-medium"
                            >
                                {slides[index].desc}
                            </motion.p>

                            <motion.div
                                custom={4}
                                variants={textVariants}
                                initial="hidden"
                                animate="visible"
                                className="flex flex-wrap gap-6"
                            >
                                <Link 
                                    href="/shop" 
                                    className="px-10 py-5 bg-white text-black rounded-full font-black text-xs uppercase tracking-[0.2em] transition-all shadow-[0_20px_50px_rgba(255,255,255,0.1)] glow-btn shine-effect"
                                    style={{'--primary': '#3b82f6'}}
                                >
                                    Explore Store
                                </Link>
                                <Link 
                                    href="/shop"
                                    className="px-10 py-5 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-full font-black text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-black text-white transition-all flex items-center gap-3 shine-effect"
                                >
                                    Full Catalogue <ArrowRight size={18} />
                                </Link>
                            </motion.div>
                        </div>

                        {/* Floative 3D Asset Slot */}
                        <motion.div
                            initial={{ opacity: 0, x: 100, rotate: 10 }}
                            animate={{ opacity: 1, x: 0, rotate: 0 }}
                            transition={{ delay: 0.5, duration: 1.2 }}
                            className="hidden lg:flex justify-center relative invisible"
                        >
                            {/* In a real app, this would be a 3D Canvas element */}
                            <div className="w-[500px] h-[500px] rounded-full border-2 border-white/5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-ping opacity-20" />
                        </motion.div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Controls */}
            <div className="absolute bottom-12 right-12 flex gap-4 z-20">
                <motion.button 
                    whileHover={{ scale: 1.1, x: -5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={prev}
                    className="w-16 h-16 rounded-full border border-white/10 bg-black/20 backdrop-blur-xl flex items-center justify-center text-white hover:bg-white hover:text-black transition-all group overflow-hidden"
                >
                    <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                </motion.button>
                <motion.button 
                    whileHover={{ scale: 1.1, x: 5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={next}
                    className="w-16 h-16 rounded-full border border-white/10 bg-black/20 backdrop-blur-xl flex items-center justify-center text-white hover:bg-white hover:text-black transition-all group overflow-hidden"
                >
                    <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
            </div>

            {/* Progress Indicators */}
            <div className="absolute left-12 bottom-12 z-20 flex flex-col gap-6">
                {slides.map((_, i) => (
                    <motion.button
                        key={i}
                        whileHover={{ x: 10 }}
                        onClick={() => setIndex(i)}
                        className="flex items-center gap-4 group"
                    >
                        <div className={`h-1 transition-all duration-500 rounded-full ${index === i ? 'w-12 bg-white' : 'w-4 bg-white/30 group-hover:bg-white/50'}`} />
                        <span className={`text-[10px] font-black tracking-[0.2em] transition-opacity uppercase ${index === i ? 'opacity-100 text-white' : 'opacity-0 text-gray-400 group-hover:opacity-50'}`}>
                            0{i + 1}
                        </span>
                    </motion.button>
                ))}
            </div>
            
            {/* HUD Scanlines */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-10 scanlines"></div>
        </section>
    );
};

export default HeroCarousel;
