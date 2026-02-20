'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Load user from local storage
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Mock login logic
    if (email && password) {
      const mockUser = {
        name: email.split('@')[0],
        email: email,
        avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=random`
      };
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      toast.success(`Welcome back, ${mockUser.name}!`);
      return true;
    }
    toast.error("Invalid credentials");
    return false;
  };

  const signup = (name, email, password) => {
    // Mock signup logic
    if (name && email && password) {
      const mockUser = {
        name: name,
        email: email,
        avatar: `https://ui-avatars.com/api/?name=${name}&background=random`
      };
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      toast.success("Account created successfully!");
      return true;
    }
    toast.error("Please fill in all fields");
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast.success("Logged out successfully");
    router.push('/login');
  };

  const requestOTP = (email) => {
    // Simulated OTP generation
    if (email) {
      const mockOtp = "123456"; // Fixed for demo
      localStorage.setItem('resetEmail', email);
      localStorage.setItem('mockOTP', mockOtp);
      toast.success("OTP sent to your email!");
      return true;
    }
    toast.error("Please enter your email");
    return false;
  };

  const verifyOTP = (otp) => {
    const savedOtp = localStorage.getItem('mockOTP');
    if (otp === savedOtp) {
      toast.success("OTP Verified!");
      return true;
    }
    toast.error("Invalid OTP");
    return false;
  };

  const resetPassword = (newPassword) => {
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    // In a real app, this would update the backend
    localStorage.removeItem('mockOTP');
    localStorage.removeItem('resetEmail');
    toast.success("Password reset successful! Please login.");
    router.push('/login');
    return true;
  };

  const updateUser = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    toast.success("Profile updated successfully!");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, requestOTP, verifyOTP, resetPassword, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
