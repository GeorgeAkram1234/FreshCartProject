/* eslint-disable react/prop-types */
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { Bounce, toast } from 'react-toastify';

export const WishlistContext = createContext();

export default function WishlistContextProvider({ children }) {
    const { userToken } = useContext(AuthContext);
    const [wishlist, setWishlist] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

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

    const addToWishlist = async (productId) => {
        try {
            const { data } = await axios.post(
                `https://ecommerce.routemisr.com/api/v1/wishlist`,
                { productId },
                { headers: { token: userToken } }
            );

            // Optimistic update or just refetch
            // To be safe and keep it simple, we can just refetch or update state if we have the product data.
            // But the API returns the new wishlist IDs usually.
            // Let's refetch to stay in sync with server.
            await getUserWishlist();

            toast.success(data.message || "Product added to wishlist", {
                position: "top-center",
                autoClose: 5000,
                theme: "light",
                transition: Bounce,
            });
        } catch (error) {
            console.error("Error adding product to wishlist:", error);
            toast.error("Failed to add product to wishlist");
        }
    };

    const removeFromWishlist = async (productId) => {
        try {
            await axios.delete(`https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`, {
                headers: { token: userToken },
            });

            // Update local state for immediate feedback
            setWishlist(prev => prev.filter(item => (item._id || item.id) !== productId));

            toast.success("Product removed from wishlist", {
                position: "top-right",
                autoClose: 5000,
                theme: "light",
                transition: Bounce,
            });
        } catch (error) {
            console.error("Error removing product from wishlist:", error);
            toast.error("Failed to remove product from wishlist");
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
