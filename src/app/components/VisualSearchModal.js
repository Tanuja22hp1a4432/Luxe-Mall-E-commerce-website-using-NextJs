'use client';

import { useState, useRef } from 'react';
import { X, Upload, Camera, Image as ImageIcon, Search as SearchIcon, Loader2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

const VisualSearchModal = ({ isOpen, onClose }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const fileInputRef = useRef(null);
  const router = useRouter();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        startScan();
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const startScan = () => {
    setIsScanning(true);
    setScanResult(null);
    
    // Simulate Intelligent Image Recognition
    setTimeout(() => {
      setIsScanning(true); // Keep showing scan progress
      
      const possibleResults = [
        { category: 'womens-dresses', label: 'Floral Mid-length Dress', confidence: 0.94 },
        { category: 'mens-shirts', label: 'Premium Cotton Shirt', confidence: 0.96 },
        { category: 'womens-shoes', label: 'Classic Leather Pumps', confidence: 0.92 },
        { category: 'smartphones', label: 'Advanced Smartphone Model', confidence: 0.98 }
      ];

      // Logic to pick a "random" but realistic match from common categories
      // In a real app, this would be the output of an object detection model
      const mockResult = possibleResults[Math.floor(Math.random() * possibleResults.length)];
      
      setIsScanning(false);
      setScanResult(mockResult);
    }, 4000);
  };

  const handleApplySearch = () => {
    if (scanResult) {
      router.push(`/shop?category=${scanResult.category}`);
      onClose();
      // Reset state
      setFile(null);
      setPreview(null);
      setScanResult(null);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-md" 
          onClick={onClose} 
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-white w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden"
        >
          <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <div>
                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Search by Photo</h3>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Find similar products using AI</p>
            </div>
            <button onClick={onClose} className="p-3 bg-white rounded-full text-gray-400 hover:text-gray-900 shadow-sm transition-colors ring-1 ring-gray-100">
              <X size={24} />
            </button>
          </div>

          <div className="p-10">
            {!preview ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="group border-4 border-dashed border-gray-100 rounded-[32px] p-16 text-center cursor-pointer hover:border-blue-100 hover:bg-blue-50/30 transition-all duration-500"
              >
                <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-blue-50 text-blue-600 mb-8 group-hover:scale-110 transition-transform duration-500 shadow-xl shadow-blue-100/50">
                  <Camera size={40} />
                </div>
                <p className="text-xl font-black text-gray-900 uppercase tracking-tighter">Upload an Image</p>
                <p className="text-sm text-gray-400 font-medium mt-3 uppercase tracking-widest leading-loose">
                  Drag and drop or click to browse <br/> (Gallery or Camera)
                </p>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleFileChange}
                />
              </div>
            ) : (
              <div className="space-y-8">
                <div className="relative aspect-square max-w-sm mx-auto rounded-[32px] overflow-hidden shadow-2xl border-8 border-white group">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  
                  {isScanning && (
                    <motion.div 
                      initial={{ top: '0%' }}
                      animate={{ top: '100%' }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      className="absolute left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-[0_0_20px_#3b82f6] z-10"
                    />
                  )}
                  
                  <AnimatePresence>
                    {isScanning && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-blue-600/20 backdrop-blur-[2px] flex items-center justify-center"
                        >
                            <div className="bg-white/90 px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3">
                                <Loader2 size={24} className="animate-spin text-blue-600" />
                                <span className="font-black text-sm uppercase tracking-widest text-gray-900">Identifying Styles...</span>
                            </div>
                        </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="text-center">
                  {isScanning ? (
                    <p className="text-gray-500 font-medium uppercase tracking-widest animate-pulse">Our AI is analyzing your image...</p>
                  ) : scanResult ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-green-50/50 p-6 rounded-[24px] border border-green-100 inline-block w-full"
                    >
                      <div className="flex items-center justify-center gap-3 text-green-600 mb-4">
                        <CheckCircle2 size={24} />
                        <span className="font-black uppercase tracking-tighter text-lg">Match Found!</span>
                      </div>
                      <p className="text-gray-900 font-bold text-xl mb-6">{scanResult.label}</p>
                      <button 
                        onClick={handleApplySearch}
                        className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl"
                      >
                        Explore Similar Products <SearchIcon size={20} />
                      </button>
                    </motion.div>
                  ) : null}
                  
                  {!isScanning && (
                    <button 
                      onClick={() => {setPreview(null); setFile(null); setScanResult(null);}}
                      className="mt-6 text-xs font-black text-gray-400 hover:text-gray-900 uppercase tracking-widest border-b-2 border-transparent hover:border-gray-200 pb-1 transition-all"
                    >
                      Try a different photo
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="bg-gray-50 p-6 text-center">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">Powered by LuxeAI Vision Processing</p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default VisualSearchModal;
