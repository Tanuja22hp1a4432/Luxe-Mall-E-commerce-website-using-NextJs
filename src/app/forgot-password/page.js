'use client';

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Mail, Lock, CheckCircle, ShieldCheck, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { requestOTP, verifyOTP, resetPassword } = useAuth();
  const router = useRouter();

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
        const success = requestOTP(email);
        if (success) setStep(2);
        setLoading(false);
    }, 1000);
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
        const success = verifyOTP(otp);
        if (success) setStep(3);
        setLoading(false);
    }, 1000);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
        setError('Passwords do not match. Please try again.');
        return;
    }

    setLoading(true);
    setTimeout(() => {
        const success = resetPassword(newPassword);
        if (success) {
            // Success logic is handled in resetPassword (router.push)
        } else {
            setLoading(false);
        }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-white p-10 rounded-[32px] shadow-2xl border border-gray-100"
      >
        <div className="text-center">
          <Link href="/login" className="inline-flex items-center text-sm font-bold text-gray-400 hover:text-gray-900 mb-8 transition-colors">
            <ArrowLeft size={16} className="mr-2" /> Back to Login
          </Link>
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-50 text-blue-600 mb-6">
            {step === 1 && <Mail size={32} />}
            {step === 2 && <ShieldCheck size={32} />}
            {step === 3 && <Lock size={32} />}
          </div>
          <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">
            {step === 1 && "Forgot Password?"}
            {step === 2 && "Enter OTP"}
            {step === 3 && "New Password"}
          </h2>
          <p className="mt-2 text-sm text-gray-500 font-medium uppercase tracking-widest">
            {step === 1 && "Enter your email to receive a reset code"}
            {step === 2 && `Code sent to ${email}`}
            {step === 3 && "Create a secure new password"}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.form 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="mt-8 space-y-6" 
              onSubmit={handleRequestOTP}
            >
              <div className="rounded-md shadow-sm">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    required
                    className="appearance-none relative block w-full px-4 py-4 pl-12 border border-gray-200 placeholder-gray-400 text-gray-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="EMAIL ADDRESS"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-4 px-4 border border-transparent text-sm font-black rounded-2xl text-white bg-gray-900 hover:bg-black transition-all shadow-xl disabled:opacity-50 uppercase tracking-widest"
              >
                {loading ? "Sending..." : "Send Reset Code"}
              </button>
            </motion.form>
          )}

          {step === 2 && (
            <motion.form 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="mt-8 space-y-6" 
              onSubmit={handleVerifyOTP}
            >
              <div className="rounded-md shadow-sm">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <ShieldCheck size={18} />
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    className="appearance-none relative block w-full px-4 py-4 pl-12 border border-gray-200 placeholder-gray-400 text-gray-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-center text-2xl tracking-[0.5em] font-black"
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-4 px-4 border border-transparent text-sm font-black rounded-2xl text-white bg-gray-900 hover:bg-black transition-all shadow-xl disabled:opacity-50 uppercase tracking-widest"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
              <p className="text-center text-xs text-gray-400 font-bold uppercase tracking-widest">
                Didn't receive code? <button type="button" onClick={() => requestOTP(email)} className="text-blue-600 hover:underline">Resend</button>
              </p>
            </motion.form>
          )}

          {step === 3 && (
            <motion.form 
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mt-8 space-y-6" 
              onSubmit={handleResetPassword}
            >
              <AnimatePresence>
                {error && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-center gap-3 text-red-600 text-[10px] font-black uppercase tracking-widest"
                    >
                        <AlertCircle size={14} />
                        {error}
                    </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    className="appearance-none relative block w-full px-4 py-4 pl-12 pr-12 border border-gray-200 placeholder-gray-400 text-gray-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="ENTER NEW PASSWORD"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-900 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    className="appearance-none relative block w-full px-4 py-4 pl-12 pr-12 border border-gray-200 placeholder-gray-400 text-gray-900 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="CONFIRM NEW PASSWORD"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-4 px-4 border border-transparent text-sm font-black rounded-2xl text-white bg-green-600 hover:bg-green-700 transition-all shadow-xl disabled:opacity-50 uppercase tracking-widest"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
