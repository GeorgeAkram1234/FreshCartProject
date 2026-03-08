import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from './AuthContext';
import axios from 'axios';
import { toast, Bounce } from 'react-toastify';

export const WishlistContext = createContext();

export default function WishlistContextProvider({ children }) {
    const { userToken } = useContext(AuthContext);
    const [wishlistIds, setWishlistIds] = useState(new Set());
    const [wishlistItems, setWishlistItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const getWishlist = useCallback(async () => {
        if (!userToken) {
            setWishlistIds(new Set());
            setWishlistItems([]);
            return;
        }
        setIsLoading(true);
        try {
            const { data } = await axios.get("https://ecommerce.routemisr.com/api/v1/wishlist", {
                headers: { token: userToken },
            });
            if (data && data.data) {
                setWishlistItems(data.data);
                setWishlistIds(new Set(data.data.map(item => item._id)));
            }
        } catch (error) {
            console.error("Error fetching wishlist:", error);
        } finally {
            setIsLoading(false);
        }
    }, [userToken]);

    useEffect(() => {
        getWishlist();
    }, [getWishlist]);

    /**
     * Optimizes performance by reducing redundant API calls.
     * Previously, each Product component fetched the entire wishlist to check its status.
     * Now, we fetch it once and use an O(1) Set lookup.
     * Performance Impact: Reduces N network requests to 1 on page load.
     */
    async function addToWishlist(productId) {
        try {
            const { data } = await axios.post(
                `https://ecommerce.routemisr.com/api/v1/wishlist`,
                { productId },
                { headers: { token: userToken } }
            );

            if (data.status === "success") {
                // Update local state for immediate feedback
                setWishlistIds(prev => new Set(prev).add(productId));
                // Refetch to get full product details if needed
                // Note: We don't await this to keep the UI responsive
                getWishlist();

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
            }
        } catch (error) {
            console.error("Error adding to wishlist:", error);
            toast.error("Failed to add product to wishlist");
        }
    }

    async function removeFromWishlist(productId) {
        try {
            const { data } = await axios.delete(
                `https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`,
                { headers: { token: userToken } }
            );

            if (data.status === "success") {
                setWishlistIds(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(productId);
                    return newSet;
                });
                setWishlistItems(prev => prev.filter(item => item._id !== productId));

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
            }
        } catch (error) {
            console.error("Error removing from wishlist:", error);
            toast.error("Failed to remove product from wishlist");
        }
    }

    return (
        <WishlistContext.Provider value={{
            wishlistIds,
            wishlistItems,
            getWishlist,
            addToWishlist,
            removeFromWishlist,
            isLoading
        }}>
            {children}
        </WishlistContext.Provider>
    );
}
