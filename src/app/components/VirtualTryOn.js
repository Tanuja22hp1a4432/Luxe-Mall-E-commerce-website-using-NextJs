'use client';

import { useState, useRef } from 'react';
import { X, Camera, Upload, Sparkles, Loader2, CheckCircle2, Info, ShoppingCart, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useShop } from '../context/ShopContext';
import toast from 'react-hot-toast';

const VirtualTryOn = ({ isOpen, onClose, product }) => {
  const [userPhoto, setUserPhoto] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isInvalidImage, setIsInvalidImage] = useState(false);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [yOffset, setYOffset] = useState(0);
  const fileInputRef = useRef(null);
  const { addToCart } = useShop();

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserPhoto(reader.result);
        startProcessing();
      };
      reader.readAsDataURL(file);
    }
  };

  const startProcessing = () => {
    setIsProcessing(true);
    setShowResult(false);
    setIsInvalidImage(false);
    
    // Simulate AI Processing & Validation
    setTimeout(() => {
      setIsProcessing(false);
      
      // Simulated "Human Body Detection" Logic
      // In a real scenario, this would be the result of a CV model analysis
      const isActuallyHuman = Math.random() > 0.15; // 85% success rate for simulation
      
      if (isActuallyHuman) {
        setShowResult(true);
      } else {
        setIsInvalidImage(true);
        toast.error('Mismatch Detected: Non-human content.', {
            icon: '⚠️',
            style: { borderRadius: '20px', background: '#333', color: '#fff' }
        });
      }
    }, 4500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-xl" 
          onClick={onClose} 
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-white w-full max-w-4xl rounded-[48px] shadow-2xl overflow-hidden flex flex-col md:flex-row h-[600px]"
        >
          {/* Close Button */}
          <button onClick={onClose} className="absolute top-6 right-6 z-20 p-3 bg-white/90 rounded-full text-gray-900 shadow-xl border border-gray-100 hover:scale-110 transition-transform">
            <X size={20} />
          </button>

          {/* Left Side: Instructions & Controls */}
          <div className="w-full md:w-1/3 p-10 bg-gray-50 flex flex-col justify-between border-r border-gray-100">
            <div>
                <div className="flex items-center gap-3 text-blue-600 mb-6 font-black uppercase tracking-widest text-xs">
                    <Sparkles size={16} /> AI Virtual Try-On
                </div>
                <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter leading-none mb-4">Fit Check</h3>
                <p className="text-gray-500 font-medium mb-8 leading-relaxed">Experience how <span className="text-gray-900 font-bold">{product.title}</span> looks on you using our neural vision technology.</p>
                
                <div className="space-y-6">
                    <div className="flex gap-4 items-start">
                        <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center font-black text-blue-600 border border-blue-50">1</div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-loose">Upload a clear front-facing photo of yourself</p>
                    </div>
                    <div className="flex gap-4 items-start">
                        <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center font-black text-blue-600 border border-blue-50">2</div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-loose">Wait for our AI to map the garment to your body</p>
                    </div>
                    <div className="flex gap-4 items-start">
                        <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center font-black text-blue-600 border border-blue-50">3</div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-loose">Adjust and explore different sizes</p>
                    </div>
                </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-gray-200 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={product.thumbnail} alt={product.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 truncate">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{product.category}</p>
                    <p className="text-xs font-black text-gray-900 uppercase tracking-tighter truncate">{product.title}</p>
                </div>
            </div>
          </div>

          {/* Right Side: Preview Area */}
          <div className="w-full md:w-2/3 bg-gray-200 relative overflow-hidden flex items-center justify-center">
            <AnimatePresence mode="wait">
                {!userPhoto ? (
                    <motion.div 
                        key="upload"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center p-12"
                    >
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-white rounded-[40px] p-20 shadow-2xl cursor-pointer hover:scale-105 transition-transform duration-500 border-4 border-dashed border-gray-100 group"
                        >
                            <div className="mx-auto w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-8 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <Upload size={40} />
                            </div>
                            <h4 className="text-xl font-black text-gray-900 uppercase tracking-tighter mb-2">Upload Photo</h4>
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">JPG, PNG (MAX 5MB)</p>
                            <input ref={fileInputRef} type="file" hidden accept="image/*" onChange={handlePhotoUpload} />
                        </div>

                        <button 
                            onClick={startProcessing}
                            className="mt-8 flex items-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-black transition-all shadow-xl"
                        >
                            <Camera size={18} /> Take a Photo (Simulated)
                        </button>
                    </motion.div>
                ) : (
                    <motion.div 
                        key="preview"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="relative w-full h-full"
                    >
                        <img src={userPhoto} alt="User" className="w-full h-full object-cover" />
                        
                        {isProcessing && (
                            <div className="absolute inset-0 bg-blue-600/30 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                                <motion.div 
                                    initial={{ top: '0%' }}
                                    animate={{ top: '100%' }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                    className="absolute left-0 w-full h-1 bg-white shadow-[0_0_20px_white] z-10"
                                />
                                <div className="bg-white/90 p-8 rounded-[32px] shadow-2xl flex flex-col items-center gap-4 text-gray-900 border border-white">
                                    <div className="relative">
                                        <Loader2 size={40} className="animate-spin text-blue-600" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Sparkles size={16} className="text-blue-400" />
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <p className="font-black uppercase tracking-widest text-xs">Neural Mapping</p>
                                        <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-wider">Analyzing Body Geometry & Image Content...</p>
                                    </div>
                                    <div className="w-48 h-1 bg-gray-100 rounded-full overflow-hidden mt-2">
                                        <motion.div 
                                            initial={{ width: "0%" }}
                                            animate={{ width: "100%" }}
                                            transition={{ duration: 4.5 }}
                                            className="h-full bg-blue-600 shadow-[0_0_10px_#3b82f6]"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Mismatch / Error State UI */}
                        {isInvalidImage && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="absolute inset-0 flex items-center justify-center p-12 bg-red-500/10 backdrop-blur-md"
                            >
                                <div className="bg-white p-12 rounded-[48px] shadow-2xl max-w-sm text-center border-4 border-red-50">
                                    <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Info size={40} />
                                    </div>
                                    <h4 className="text-2xl font-black text-gray-900 uppercase tracking-tighter mb-4 leading-none">Mismatch Detected</h4>
                                    <p className="text-sm font-medium text-gray-500 mb-8 leading-relaxed">
                                        This image doesn't match our requirements. Please upload a <span className="text-gray-900 font-bold">clear front-facing photo</span> of yourself for the best experience.
                                    </p>
                                    <button 
                                        onClick={() => {setUserPhoto(null); setIsInvalidImage(false);}}
                                        className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-black transition-all shadow-xl"
                                    >
                                        Try Another Photo
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {showResult && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute inset-0 flex items-center justify-center"
                            >
                                <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                                     {/* Background Pulse Effect */}
                                    <div className="absolute inset-0 bg-blue-600/5 animate-pulse"></div>
                                    
                                    {/* Simulated Pose Grid */}
                                    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                                    {/* Simulated Try-On Overlay with Fit Adjustments */}
                                    <div className="relative w-full h-full flex items-center justify-center p-20">
                                        <motion.img 
                                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                            animate={{ 
                                                opacity: 0.9, 
                                                scale: 1.05 * scale, 
                                                y: yOffset,
                                                rotate: rotation 
                                            }}
                                            transition={{ type: "spring", damping: 15 }}
                                            src={product.thumbnail} 
                                            alt="Garment Overlay" 
                                            className="max-h-[80%] w-auto object-contain mix-blend-multiply filter contrast-125 brightness-110 drop-shadow-[0_20px_50px_rgba(59,130,246,0.3)]"
                                        />
                                        
                                        {/* Hud UI on top of model */}
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <div className="relative w-[300px] h-[500px] border border-blue-400/30 rounded-[100px] flex items-center justify-center">
                                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white text-[8px] px-3 py-1 rounded-full font-bold">SHOULDER ALIGNMENT</div>
                                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-blue-600 text-white text-[8px] px-3 py-1 rounded-full font-bold">WAIST CALIBRATION</div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="absolute inset-x-10 bottom-10 flex flex-col gap-8">
                                        {/* Adjustment HUD - Centered and Transparent */}
                                        <motion.div 
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-white/10 backdrop-blur-2xl p-8 rounded-[40px] shadow-2xl border border-white/20 grid grid-cols-2 gap-10 max-w-2xl mx-auto ring-1 ring-white/10"
                                        >
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center">
                                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Garment Scale</p>
                                                    <span className="text-[10px] font-black text-white bg-blue-600 px-2 py-0.5 rounded-full">{(scale * 100).toFixed(0)}%</span>
                                                </div>
                                                <input 
                                                    type="range" 
                                                    min="0.5" 
                                                    max="2.0" 
                                                    step="0.01" 
                                                    value={scale} 
                                                    onChange={(e) => setScale(parseFloat(e.target.value))} 
                                                    className="w-full h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer accent-white hover:accent-blue-400 transition-all" 
                                                />
                                            </div>
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center">
                                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Rotation Axis</p>
                                                    <span className="text-[10px] font-black text-white bg-blue-600 px-2 py-0.5 rounded-full">{rotation}°</span>
                                                </div>
                                                <input 
                                                    type="range" 
                                                    min="-90" 
                                                    max="90" 
                                                    value={rotation} 
                                                    onChange={(e) => setRotation(parseInt(e.target.value))} 
                                                    className="w-full h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer accent-white hover:accent-blue-400 transition-all" 
                                                />
                                            </div>
                                        </motion.div>

                                        <div className="flex justify-between items-end">
                                            <div className="flex gap-4">
                                                <motion.div 
                                                    initial={{ scale: 0.9, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    className="bg-white/90 backdrop-blur-md px-8 py-4 rounded-[32px] shadow-2xl border border-white flex items-center gap-5"
                                                >
                                                    <div className="h-12 w-12 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-green-200">
                                                        <CheckCircle2 size={24} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black uppercase tracking-tighter text-gray-900 leading-none">Perfect Match!</p>
                                                        <p className="text-[10px] font-bold text-gray-400 mt-1.5 uppercase tracking-widest">Recommended: Size M</p>
                                                    </div>
                                                </motion.div>

                                                <button 
                                                    onClick={() => addToCart(product)}
                                                    className="bg-blue-600 text-white px-10 rounded-[32px] font-black uppercase tracking-[0.15em] text-xs shadow-2xl hover:bg-blue-700 hover:scale-105 transition-all flex items-center gap-4 border border-blue-400/50"
                                                >
                                                    <ShoppingCart size={20} /> Add to Cart
                                                </button>
                                            </div>

                                            <div className="flex gap-4">
                                                <button 
                                                    onClick={() => toast.success('Fit Preview Saved!')}
                                                    className="bg-white/90 backdrop-blur-md p-5 rounded-full text-gray-900 shadow-2xl hover:scale-110 transition-transform border border-white ring-1 ring-gray-100"
                                                >
                                                    <Upload size={24} className="rotate-180" />
                                                </button>
                                                <button 
                                                    onClick={() => {setUserPhoto(null); setShowResult(false); setScale(1); setRotation(0); setIsInvalidImage(false);}}
                                                    className="bg-gray-900 p-5 rounded-full text-white shadow-2xl hover:scale-110 transition-transform ring-1 ring-white/20"
                                                >
                                                    <RefreshCw size={24} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
            
            <div className="absolute top-10 left-1/2 -translate-x-1/2 flex items-center gap-4">
                <div className="bg-black/20 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 text-[10px] font-black text-white uppercase tracking-widest ring-1 ring-white/10">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div> HD RENDER ACTIVE
                </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default VirtualTryOn;
