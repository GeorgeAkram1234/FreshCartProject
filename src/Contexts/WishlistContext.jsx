/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { Bounce, toast } from 'react-toastify';

export const WishlistContext = createContext();

export default function WishlistContextProvider({ children }) {
    const { userToken } = useContext(AuthContext);
    const [wishlist, setWishlist] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    /**
     * Performance Optimization:
     * By using a Set for wishlist IDs, we achieve O(1) lookup time for presence checks
     * in individual product components. This prevents redundant O(N) array scans
     * during list rendering.
     */
    const wishlistIds = useMemo(() => new Set(wishlist.map(item => item._id || item.id)), [wishlist]);

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

    const addToWishlist = async (product) => {
        if (!userToken) return;
        try {
            // Optimistic Update: Add to local state first
            setWishlist((prev) => [...prev, product]);

            const { data } = await axios.post(
                `https://ecommerce.routemisr.com/api/v1/wishlist`,
                { productId: product._id },
                { headers: { token: userToken } }
            );

            toast.success(data.message || "Added to wishlist", {
                position: "top-center",
                autoClose: 2000,
                transition: Bounce,
            });

            // Refetch to ensure sync with server (or use data.data if returned)
            getUserWishlist();
        } catch (error) {
            // Rollback on error
            getUserWishlist();
            toast.error("Failed to add to wishlist");
        }
    };

    const removeFromWishlist = async (productId) => {
        if (!userToken) return;
        try {
            // Optimistic Update
            setWishlist((prev) => prev.filter(item => (item._id || item.id) !== productId));

            await axios.delete(`https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`, {
                headers: { token: userToken },
            });

            toast.success("Removed from wishlist", {
                position: "top-right",
                autoClose: 2000,
                transition: Bounce,
            });

            getUserWishlist();
        } catch (error) {
            getUserWishlist();
            toast.error("Failed to remove from wishlist");
        }
    };

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
