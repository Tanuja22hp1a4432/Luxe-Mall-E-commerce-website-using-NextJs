'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [floatingHearts, setFloatingHearts] = useState([]);

  const [orders, setOrders] = useState([]);

  // Load from local storage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedWishlist = localStorage.getItem('wishlist');
    const savedOrders = localStorage.getItem('orders');
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    if (savedOrders) setOrders(JSON.parse(savedOrders));
  }, []);

  // Save to local storage whenever state changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    
    // Simulate Wishlist Sale Notification
    const saleItems = wishlist.filter(item => item.discountPercentage > 15);
    if (saleItems.length > 0 && Math.random() > 0.7) {
      toast(`Wishlist Alert: ${saleItems[0].title} is now ${Math.round(saleItems[0].discountPercentage)}% OFF!`, {
        icon: '🔥',
        duration: 5000
      });
    }
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  const placeOrder = (billingDetails) => {
      const newOrder = {
          id: `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          date: new Date().toLocaleDateString(),
          items: [...cart],
          total: cartTotal,
          status: 'Delivered', // Mocking as delivered for return testing
          billingDetails
      };
      setOrders(prev => [newOrder, ...prev]);
      clearCart();
      return newOrder;
  };

  const requestReturn = (orderId, reason, note) => {
      setOrders(prev => prev.map(order => 
          order.id === orderId 
          ? { ...order, status: 'Return Requested', returnDetails: { reason, note, date: new Date().toLocaleDateString() } } 
          : order
      ));
      toast.success("Return request submitted successfully");
  };

  const addToCart = (product, quantity = 1) => {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      setCart((prev) =>
        prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        )
      );
      toast.success(`Updated quantity for ${product.title}`);
    } else {
      setCart((prev) => [...prev, { ...product, quantity }]);
      toast.success(`Added ${product.title} to cart`);
    }
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
    toast.error("Removed from cart");
  };

  const updateQuantity = (productId, delta) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === productId) {
          const newQuantity = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const toggleWishlist = (product, e) => {
    const exists = wishlist.find((item) => item.id === product.id);
    if (exists) {
      setWishlist((prev) => prev.filter((item) => item.id !== product.id));
      toast("Removed from wishlist", { icon: '💔' });
    } else {
      setWishlist((prev) => [...prev, product]);
      toast("Added to wishlist", { icon: '❤️' });
      
      // Trigger floating heart animation
      const rect = e?.target?.getBoundingClientRect() || { left: window.innerWidth / 2, top: window.innerHeight / 2 };
      const newHeart = {
        id: Date.now(),
        x: e?.clientX || rect.left + rect.width / 2,
        y: e?.clientY || rect.top + rect.height / 2
      };
      setFloatingHearts(prev => [...prev, newHeart]);
      
      // Clean up heart after animation
      setTimeout(() => {
        setFloatingHearts(prev => prev.filter(h => h.id !== newHeart.id));
      }, 1000);
    }
  };

  const clearCart = () => {
      setCart([]);
      localStorage.removeItem('cart');
  };

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <ShopContext.Provider
      value={{
        cart,
        wishlist,
        orders,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleWishlist,
        floatingHearts,
        clearCart,
        placeOrder,
        requestReturn,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => useContext(ShopContext);
