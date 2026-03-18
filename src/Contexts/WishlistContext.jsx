import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { toast, Bounce } from 'react-toastify';

export const WishlistContext = createContext();

/* eslint-disable react/prop-types */
export default function WishlistProvider({ children }) {
    const { userToken } = useContext(AuthContext);
    const [wishlist, setWishlist] = useState([]);
    const [wishlistIds, setWishlistIds] = useState(new Set());
    const [isLoading, setIsLoading] = useState(false);

    const getWishlist = useCallback(async () => {
        if (!userToken) {
            setWishlist([]);
            setWishlistIds(new Set());
            return;
        }
        setIsLoading(true);
        try {
            const { data } = await axios.get("https://ecommerce.routemisr.com/api/v1/wishlist", {
                headers: { token: userToken }
            });
            if (data && data.data) {
                setWishlist(data.data);
                setWishlistIds(new Set(data.data.map(item => item._id || item.id)));
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

    async function addToWishlist(productId) {
        try {
            // Optimistic update
            setWishlistIds(prev => new Set(prev).add(productId));

            const { data } = await axios.post(
                "https://ecommerce.routemisr.com/api/v1/wishlist",
                { productId },
                { headers: { token: userToken } }
            );

            toast.success(data.message || "Product added to wishlist", {
                position: "top-center",
                autoClose: 2000,
                theme: "light",
                transition: Bounce,
            });

            // Refresh full wishlist to get full product objects
            getWishlist();
        } catch (error) {
            // Rollback
            setWishlistIds(prev => {
                const next = new Set(prev);
                next.delete(productId);
                return next;
            });
            toast.error("Failed to add product to wishlist");
        }
    }

    async function removeFromWishlist(productId) {
        try {
            // Optimistic update
            setWishlistIds(prev => {
                const next = new Set(prev);
                next.delete(productId);
                return next;
            });
            setWishlist(prev => prev.filter(item => (item._id || item.id) !== productId));

            const { data } = await axios.delete(
                `https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`,
                { headers: { token: userToken } }
            );

            toast.success(data.message || "Removed from wishlist", {
                position: "top-center",
                autoClose: 2000,
                theme: "light",
                transition: Bounce,
            });
        } catch (error) {
            // Rollback (simplest is to re-fetch)
            getWishlist();
            toast.error("Failed to remove product from wishlist");
        }
    }

    return (
        <WishlistContext.Provider value={{
            wishlist,
            wishlistIds,
            addToWishlist,
            removeFromWishlist,
            isLoading
        }}>
            {children}
        </WishlistContext.Provider>
    );
}
