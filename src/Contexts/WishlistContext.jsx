import { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { toast, Bounce } from 'react-toastify';

export const WishlistContext = createContext();

/* eslint-disable react/prop-types */
export function WishlistProvider({ children }) {
    const { userToken } = useContext(AuthContext);
    const [wishlist, setWishlist] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const wishlistIds = useMemo(() => new Set(wishlist.map(item => item._id || item.id)), [wishlist]);

    const getUserWishlist = useCallback(async () => {
        if (!userToken) return;
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
        if (userToken) {
            getUserWishlist();
        } else {
            setWishlist([]);
        }
    }, [userToken, getUserWishlist]);

    const addToWishlist = async (product) => {
        if (!userToken) return;

        // Optimistic update
        const productId = product._id || product.id;
        if (wishlistIds.has(productId)) return;

        setWishlist(prev => [...prev, product]);

        try {
            const { data } = await axios.post(
                `https://ecommerce.routemisr.com/api/v1/wishlist`,
                { productId },
                { headers: { token: userToken } }
            );
            toast.success(data.message, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: true,
                theme: "light",
                transition: Bounce,
            });
            // Refetch to ensure we have full product data from server if needed
            getUserWishlist();
        } catch (error) {
            console.error("Error adding to wishlist:", error);
            // Rollback
            setWishlist(prev => prev.filter(item => (item._id || item.id) !== productId));
            toast.error("Failed to add product to wishlist.");
        }
    };

    const removeFromWishlist = async (productId) => {
        if (!userToken) return;

        // Optimistic update
        const removedProduct = wishlist.find(item => (item._id || item.id) === productId);
        setWishlist(prev => prev.filter(item => (item._id || item.id) !== productId));

        try {
            await axios.delete(`https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`, {
                headers: { token: userToken },
            });
            toast.success("Product removed from wishlist", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                theme: "light",
                transition: Bounce,
            });
        } catch (error) {
            console.error("Error removing from wishlist:", error);
            // Rollback
            if (removedProduct) {
                setWishlist(prev => [...prev, removedProduct]);
            }
            toast.error("Failed to remove product from wishlist");
        }
    };

    return (
        <WishlistContext.Provider value={{
            wishlist,
            wishlistIds,
            addToWishlist,
            removeFromWishlist,
            isLoading,
            getUserWishlist
        }}>
            {children}
        </WishlistContext.Provider>
    );
}
