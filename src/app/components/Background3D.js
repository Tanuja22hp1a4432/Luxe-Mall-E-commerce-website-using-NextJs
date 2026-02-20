'use client';

import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const Background3D = () => {
  const canvasRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const mousePos = useRef({ x: 0, y: 0 });
  
  // Transform scroll position to rotation for the background
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const rotateY = useTransform(scrollYProgress, [0, 1], [0, 360]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mousePos.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 40,
        y: (e.clientY / window.innerHeight - 0.5) * 40
      };
    };
    window.addEventListener('mousemove', handleMouseMove);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let particles = [];
    let orbs = [];
    const particleCount = 100;
    const orbCount = 8;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.z = Math.random() * 2000;
        this.size = Math.random() * 1.5 + 0.2;
        this.vx = (Math.random() - 0.5) * 0.1; // Ultra slow motion
        this.vy = (Math.random() - 0.5) * 0.1;
        this.vz = -Math.random() * 0.5;
        this.color = `rgba(59, 130, 246, ${Math.random() * 0.2 + 0.05})`;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.z += this.vz;
        if (this.z < 0) this.reset();
      }

      draw() {
        const perspective = 1000;
        const scale = perspective / (perspective + this.z);
        const x2d = (this.x - canvas.width / 2) * scale + canvas.width / 2 + mousePos.current.x * (1 - scale);
        const y2d = (this.y - canvas.height / 2) * scale + canvas.height / 2 + mousePos.current.y * (1 - scale);

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(x2d, y2d, this.size * scale, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    class Orb {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.z = Math.random() * 1500;
        this.radius = Math.random() * 100 + 50;
        this.vx = (Math.random() - 0.5) * 0.05;
        this.vy = (Math.random() - 0.5) * 0.05;
        this.color = Math.random() > 0.5 ? 'rgba(59, 130, 246, 0.03)' : 'rgba(168, 85, 247, 0.03)';
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
      }
      draw() {
        const perspective = 1000;
        const scale = perspective / (perspective + this.z);
        const x2d = (this.x - canvas.width / 2) * scale + canvas.width / 2 + mousePos.current.x * (1 - scale) * 2;
        const y2d = (this.y - canvas.height / 2) * scale + canvas.height / 2 + mousePos.current.y * (1 - scale) * 2;

        const gradient = ctx.createRadialGradient(x2d, y2d, 0, x2d, y2d, this.radius * scale);
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x2d, y2d, this.radius * scale, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = `rgba(255, 255, 255, 0.05)`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }

    const init = () => {
      particles = [];
      orbs = [];
      for (let i = 0; i < particleCount; i++) particles.push(new Particle());
      for (let i = 0; i < orbCount; i++) orbs.push(new Orb());
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      orbs.forEach(o => { o.update(); o.draw(); });
      particles.forEach(p => { p.update(); p.draw(); });

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize();
    init();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none bg-[#050505] overflow-hidden">
      {/* Cinematic Nebula Glows */}
      <motion.div 
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.08, 0.12, 0.08],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-blue-600 rounded-full blur-[200px] mix-blend-screen"
      />
      <motion.div 
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.05, 0.08, 0.05],
          x: [0, -40, 0],
          y: [0, -60, 0],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-20%] right-[-10%] w-[80%] h-[80%] bg-purple-900 rounded-full blur-[250px] mix-blend-screen"
      />

      <motion.div 
        style={{ rotateX, rotateY, perspective: 1200 }}
        className="w-full h-full"
      >
        <canvas 
            ref={canvasRef} 
            className="w-full h-full opacity-60"
        />
      </motion.div>
      
      {/* Decorative Spatial Grid */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{ 
          backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: '100px 100px',
          transform: 'perspective(1000px) rotateX(60deg) translateY(200px) scale(2)'
        }} 
      />
    </div>
  );
};

export default Background3D;
