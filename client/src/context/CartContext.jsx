import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext.jsx';
import {
  addToCart as addToCartRequest,
  clearCart as clearCartRequest,
  getCart as getCartRequest,
  removeCartItem as removeCartItemRequest,
  updateCartItem as updateCartItemRequest,
} from '../services/cartService.js';

const CartContext = createContext(null);

const CartProvider = ({ children }) => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const syncCartState = (data) => {
    const items = data?.items || [];
    setCartItems(items);
    setTotalItems(data?.totalItems || 0);
    setTotalPrice(data?.totalPrice || 0);
  };

  const clearMessageLater = () => {
    window.setTimeout(() => setSuccessMessage(''), 2200);
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    clearMessageLater();
  };

  const fetchCart = async () => {
    if (!isAuthenticated) {
      setCartItems([]);
      setTotalItems(0);
      setTotalPrice(0);
      return;
    }

    try {
      setLoading(true);
      setError('');
      const data = await getCartRequest();
      syncCartState(data);
    } catch (requestError) {
      setError(requestError?.response?.data?.message || requestError?.message || 'Failed to fetch cart');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      setLoading(true);
      setError('');
      const data = await addToCartRequest({ productId, quantity });
      syncCartState(data);
      showSuccess('Added to cart');
      return data;
    } catch (requestError) {
      const message = requestError?.response?.data?.message || requestError?.message || 'Failed to add to cart';
      setError(message);
      throw requestError;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      setLoading(true);
      setError('');
      const data = await updateCartItemRequest(productId, { quantity });
      syncCartState(data);
      showSuccess('Cart updated');
      return data;
    } catch (requestError) {
      const message = requestError?.response?.data?.message || requestError?.message || 'Failed to update cart';
      setError(message);
      throw requestError;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      setLoading(true);
      setError('');
      const data = await removeCartItemRequest(productId);
      syncCartState(data);
      showSuccess('Item removed');
      return data;
    } catch (requestError) {
      const message = requestError?.response?.data?.message || requestError?.message || 'Failed to remove item';
      setError(message);
      throw requestError;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await clearCartRequest();
      syncCartState(data);
      showSuccess('Cart cleared');
      return data;
    } catch (requestError) {
      const message = requestError?.response?.data?.message || requestError?.message || 'Failed to clear cart';
      setError(message);
      throw requestError;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchCart();
    }
  }, [isAuthenticated, authLoading]);

  const value = useMemo(
    () => ({
      cartItems,
      totalItems,
      totalPrice,
      loading,
      error,
      successMessage,
      fetchCart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      setError,
      setSuccessMessage,
    }),
    [cartItems, totalItems, totalPrice, loading, error, successMessage],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }

  return context;
};

export { CartProvider, useCart };
