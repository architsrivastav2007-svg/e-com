import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext.jsx';
import {
  addToWishlist as addToWishlistRequest,
  clearWishlist as clearWishlistRequest,
  getWishlist as getWishlistRequest,
  removeFromWishlist as removeFromWishlistRequest,
} from '../services/wishlistService.js';

const WishlistContext = createContext(null);

const WishlistProvider = ({ children }) => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const syncWishlistState = (data) => {
    const items = data?.wishlist?.products || data?.products || data?.items || [];
    setWishlistItems(items);
  };

  const clearMessageLater = () => {
    window.setTimeout(() => setSuccessMessage(''), 2200);
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    clearMessageLater();
  };

  const fetchWishlist = async () => {
    if (!isAuthenticated) {
      setWishlistItems([]);
      return;
    }

    try {
      setLoading(true);
      setError('');
      const data = await getWishlistRequest();
      syncWishlistState(data);
    } catch (requestError) {
      setError(requestError?.response?.data?.message || requestError?.message || 'Failed to fetch wishlist');
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (productId) => {
    try {
      setLoading(true);
      setError('');
      const data = await addToWishlistRequest(productId);
      syncWishlistState(data);
      showSuccess(data?.message || 'Added to wishlist');
      return data;
    } catch (requestError) {
      const message = requestError?.response?.data?.message || requestError?.message || 'Failed to add to wishlist';
      setError(message);
      throw requestError;
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      setLoading(true);
      setError('');
      const data = await removeFromWishlistRequest(productId);
      syncWishlistState(data);
      showSuccess(data?.message || 'Removed from wishlist');
      return data;
    } catch (requestError) {
      const message = requestError?.response?.data?.message || requestError?.message || 'Failed to remove from wishlist';
      setError(message);
      throw requestError;
    } finally {
      setLoading(false);
    }
  };

  const clearWishlist = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await clearWishlistRequest();
      syncWishlistState(data);
      showSuccess(data?.message || 'Wishlist cleared');
      return data;
    } catch (requestError) {
      const message = requestError?.response?.data?.message || requestError?.message || 'Failed to clear wishlist';
      setError(message);
      throw requestError;
    } finally {
      setLoading(false);
    }
  };

  const isInWishlist = (productId) => wishlistItems.some((item) => item._id === productId);

  useEffect(() => {
    if (!authLoading) {
      fetchWishlist();
    }
  }, [isAuthenticated, authLoading]);

  const value = useMemo(
    () => ({
      wishlistItems,
      itemCount: wishlistItems.length,
      loading,
      error,
      successMessage,
      fetchWishlist,
      addToWishlist,
      removeFromWishlist,
      clearWishlist,
      isInWishlist,
      setError,
      setSuccessMessage,
    }),
    [wishlistItems, loading, error, successMessage],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

const useWishlist = () => {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }

  return context;
};

export { WishlistProvider, useWishlist };
