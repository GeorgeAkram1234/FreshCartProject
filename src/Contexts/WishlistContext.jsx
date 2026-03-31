/* eslint-disable react/prop-types */
import { createContext, useState, useEffect, useContext, useMemo, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { toast, Bounce } from 'react-toastify';

export const WishlistContext = createContext();

export default function WishlistContextProvider({ children }) {
  const { userToken } = useContext(AuthContext);
  const [wishlist, setWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Derive a Set of IDs for O(1) presence checks
  const wishlistIds = useMemo(() => {
    return new Set(wishlist.map(item => item._id || item.id));
  }, [wishlist]);

  const getUserWishlist = useCallback(async () => {
    if (!userToken) {
      setWishlist([]);
      return;
    }
    setIsLoading(true);
    try {
      const { data } = await axios.get("https://ecommerce.routemisr.com/api/v1/wishlist", {
        headers: { token: userToken }
      });
      if (data && Array.isArray(data.data)) {
        setWishlist(data.data);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userToken]);

  useEffect(() => {
    getUserWishlist();
  }, [getUserWishlist]);

  const addToWishlist = useCallback(async (productId) => {
    if (!userToken) return;
    // Optimistic update: temporarily add product ID to wishlist
    // Note: This won't include full product details, but will correctly
    // update the UI heart icons via the derived wishlistIds Set.
    setWishlist(prev => [...prev, { _id: productId }]);

    try {
      const { data } = await axios.post(
        `https://ecommerce.routemisr.com/api/v1/wishlist`,
        { productId },
        { headers: { token: userToken } }
      );

      toast.success(data.message, {
        position: "top-center",
        autoClose: 5000,
        theme: "light",
        transition: Bounce,
      });

      // Refetch to get actual full product object from API and ensure sync
      getUserWishlist();
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      toast.error("Failed to add product to wishlist");
      // Rollback optimistic update
      setWishlist(prev => prev.filter(item => (item._id || item.id) !== productId));
    }
  }, [userToken, getUserWishlist]);

  const removeFromWishlist = useCallback(async (productId) => {
    if (!userToken) return;
    try {
      await axios.delete(`https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`, {
        headers: { token: userToken }
      });

      toast.success("Product removed from wishlist", {
        position: "top-right",
        autoClose: 5000,
        theme: "light",
        transition: Bounce,
      });

      // Optimistic update or refetch
      setWishlist(prev => prev.filter(item => (item._id || item.id) !== productId));
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast.error("Failed to remove product from wishlist");
    }
  }, [userToken]);

  return (
    <WishlistContext.Provider value={{
      wishlist,
      wishlistIds,
      isLoading,
      addToWishlist,
      removeFromWishlist,
      getUserWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
}
