'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useShop } from '../context/ShopContext';

const HeartAnimation = () => {
    const { floatingHearts } = useShop();

    return (
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
            <AnimatePresence>
                {floatingHearts.map((heart) => (
                    <motion.div
                        key={heart.id}
                        initial={{ 
                            opacity: 0, 
                            scale: 0.5, 
                            x: heart.x - 12, 
                            y: heart.y - 12 
                        }}
                        animate={{ 
                            opacity: [0, 1, 1, 0], 
                            scale: [0.5, 1.5, 1.2, 1], 
                            y: heart.y - 200,
                            x: heart.x - 12 + (Math.random() * 100 - 50) 
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ 
                            duration: 1, 
                            ease: "easeOut" 
                        }}
                        className="absolute text-2xl select-none"
                    >
                        ❤️
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default HeartAnimation;
