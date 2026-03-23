/* eslint-disable react/prop-types */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast, Bounce } from 'react-toastify';
import { AuthContext } from './AuthContext';

export const WishlistContext = createContext();

/**
 * WishlistContextProvider manages the user's wishlist state globally.
 *
 * Performance Optimizations:
 * 1. Single Fetch: Fetches the entire wishlist once on mount or when the user token changes,
 *    rather than having each Product component fetch its own status.
 * 2. O(1) Lookups: Maintains a Set of wishlist item IDs (`wishlistIds`) for constant-time
 *    checks in the `isInWishlist` function, which is used by many Product cards in a list.
 * 3. Reactive State: Updates the global state after add/remove actions, ensuring all
 *    components stay in sync without redundant API calls.
 */
export default function WishlistContextProvider({ children }) {
    const { userToken } = useContext(AuthContext);
    const [wishlist, setWishlist] = useState([]);
    const [wishlistIds, setWishlistIds] = useState(new Set());
    const [isLoading, setIsLoading] = useState(false);

    const getUserWishlist = useCallback(async () => {
        if (!userToken) return;
        setIsLoading(true);
        try {
            const { data } = await axios.get("https://ecommerce.routemisr.com/api/v1/wishlist", {
                headers: { token: userToken },
            });
            if (data && Array.isArray(data.data)) {
                setWishlist(data.data);
                // Store IDs in a Set for O(1) lookups in Product lists
                setWishlistIds(new Set(data.data.map(item => item._id)));
            }
        } catch (error) {
            console.error("Error fetching wishlist:", error);
        } finally {
            setIsLoading(false);
        }
    }, [userToken]);

    useEffect(() => {
        if (userToken) {
            getUserWishlist();
        } else {
            // Clear state when user logs out
            setWishlist([]);
            setWishlistIds(new Set());
        }
    }, [userToken, getUserWishlist]);

    const addToWishlist = async (productId) => {
        try {
            const { data } = await axios.post(
                `https://ecommerce.routemisr.com/api/v1/wishlist`,
                { productId },
                { headers: { token: userToken } }
            );

            if (data.status === 'success') {
                toast.success(data.message, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Bounce,
                });
                // Refresh the global wishlist state
                getUserWishlist();
            }
        } catch (error) {
            console.error("Error adding to wishlist:", error);
            toast.error("Failed to add to wishlist");
        }
    };

    const removeFromWishlist = async (productId) => {
        try {
            const { data } = await axios.delete(
                `https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`,
                { headers: { token: userToken } }
            );
            if (data.status === 'success') {
                toast.success(data.message, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Bounce,
                });
                // Refresh the global wishlist state
                getUserWishlist();
            }
        } catch (error) {
            console.error("Error removing from wishlist:", error);
            toast.error("Failed to remove from wishlist");
        }
    };

    /**
     * Checks if a product is in the wishlist using the O(1) Set.
     */
    const isInWishlist = (productId) => {
        return wishlistIds.has(productId);
    };

    return (
        <WishlistContext.Provider value={{
            wishlist,
            isLoading,
            addToWishlist,
            removeFromWishlist,
            isInWishlist,
            getUserWishlist
        }}>
            {children}
        </WishlistContext.Provider>
    );
}
