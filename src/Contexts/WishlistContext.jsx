/* eslint-disable react/prop-types */
import axios from 'axios';
import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { AuthContext } from './AuthContext';
import { Bounce, toast } from 'react-toastify';

export const WishlistContext = createContext();

export default function WishlistContextProvider({ children }) {
    const { userToken } = useContext(AuthContext);
    const [wishlistData, setWishlistData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Derived state: A Set of wishlist product IDs for O(1) lookups.
    // This optimization replaces redundant O(N) API calls with O(1) checks.
    const wishlistIds = useMemo(() => new Set(wishlistData.map(product => product._id)), [wishlistData]);

    const getUserWishlist = useCallback(async () => {
        if (!userToken) {
            setWishlistData([]);
            return;
        }

        setIsLoading(true);
        try {
            const { data } = await axios.get("https://ecommerce.routemisr.com/api/v1/wishlist", {
                headers: { token: userToken },
            });

            if (data && Array.isArray(data.data)) {
                setWishlistData(data.data);
            }
        } catch (error) {
            console.error("Error fetching wishlist:", error);
            // Non-blocking error for the background fetch
        } finally {
            setIsLoading(false);
        }
    }, [userToken]);

    const addToWishlist = useCallback(async (productId) => {
        if (!userToken) return;

        try {
            const { data } = await axios.post(
                `https://ecommerce.routemisr.com/api/v1/wishlist`,
                { productId },
                { headers: { token: userToken } }
            );

            if (data.status === "success") {
                toast.success(data.message, {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "light",
                    transition: Bounce,
                });
                // Optimistic UI update or refetch
                getUserWishlist();
            }
        } catch (error) {
            console.error("Error adding product to wishlist:", error);
            toast.error("Failed to add product to wishlist. Please try again.");
        }
    }, [userToken, getUserWishlist]);

    const removeFromWishlist = useCallback(async (productId) => {
        if (!userToken) return;

        try {
            const { data } = await axios.delete(
                `https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`,
                { headers: { token: userToken } }
            );

            if (data.status === "success") {
                toast.success(data.message, {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "light",
                    transition: Bounce,
                });
                // Refetch after removal
                getUserWishlist();
            }
        } catch (error) {
            console.error("Error removing product from wishlist:", error);
            toast.error("Failed to remove product from wishlist.");
        }
    }, [userToken, getUserWishlist]);

    useEffect(() => {
        getUserWishlist();
    }, [getUserWishlist]);

    return (
        <WishlistContext.Provider
            value={{
                wishlistData,
                wishlistIds,
                isLoading,
                getUserWishlist,
                addToWishlist,
                removeFromWishlist,
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
}
