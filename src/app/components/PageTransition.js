'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

const PageTransition = ({ children }) => {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, x: 100, rotateY: 30, scale: 0.9 }}
        animate={{ opacity: 1, x: 0, rotateY: 0, scale: 1 }}
        exit={{ opacity: 0, x: -100, rotateY: -30, scale: 0.9 }}
        transition={{
          duration: 0.6,
          ease: [0.16, 1, 0.3, 1],
        }}
        style={{ perspective: 2000 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;
