import { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import { toast, Bounce } from "react-toastify";

export const WishlistContext = createContext();

/* eslint-disable react/prop-types */
export default function WishlistContextProvider({ children }) {
  const { userToken } = useContext(AuthContext);
  const [wishlist, setWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const wishlistIds = useMemo(() => new Set(wishlist.map((item) => item._id || item.id)), [wishlist]);

  const getUserWishlist = useCallback(async () => {
    if (!userToken) {
      setWishlist([]);
      return;
    }
    setIsLoading(true);
    try {
      const { data } = await axios.get("https://ecommerce.routemisr.com/api/v1/wishlist", {
        headers: { token: userToken },
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

  const addToWishlist = async (productId) => {
    // Optimistic update: We don't have the full product object here,
    // but we can add a placeholder to the Set-based wishlistIds by updating wishlist state.
    // However, since wishlist is an array of objects, we can only do a partial update.
    // For now, let's keep it simple and refetch, but a more advanced approach would be
    // to pass the product object to this function.
    try {
      const { data } = await axios.post(
        "https://ecommerce.routemisr.com/api/v1/wishlist",
        { productId },
        { headers: { token: userToken } }
      );
      if (data.status === "success") {
        toast.success(data.message, { transition: Bounce });
        // Refetch to get the full product details and ensure state is in sync with server
        getUserWishlist();
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      toast.error("Failed to add product to wishlist");
    }
  };

  const removeFromWishlist = async (productId) => {
    // Optimistic update
    const previousWishlist = [...wishlist];
    setWishlist((prev) => prev.filter((item) => (item._id || item.id) !== productId));

    try {
      const { data } = await axios.delete(
        `https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`,
        { headers: { token: userToken } }
      );
      if (data.status === "success") {
        toast.success(data.message, { transition: Bounce });
        // No need to refetch if successful, as we already updated state
      } else {
        // If not successful, roll back
        setWishlist(previousWishlist);
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast.error("Failed to remove product from wishlist");
      // Roll back on error
      setWishlist(previousWishlist);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistIds,
        isLoading,
        addToWishlist,
        removeFromWishlist,
        getUserWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}
