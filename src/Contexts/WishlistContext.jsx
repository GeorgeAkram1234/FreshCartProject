/* eslint-disable react/prop-types */
import { createContext, useState, useContext, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { toast, Bounce } from 'react-toastify';

export const WishlistContext = createContext();

export default function WishlistContextProvider({ children }) {
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
                headers: { token: userToken },
            });
            if (data && data.status === "success") {
                setWishlist(data.data);
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

    const addToWishlist = useCallback(async (productId) => {
        if (!userToken) {
            toast.error("Please login first");
            return;
        }
        try {
            const { data } = await axios.post(
                "https://ecommerce.routemisr.com/api/v1/wishlist",
                { productId },
                { headers: { token: userToken } }
            );
            if (data && data.status === "success") {
                toast.success(data.message || "Product added to wishlist", {
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
                setWishlistIds(prev => new Set(prev).add(productId));
                getWishlist(); // Refresh full list to keep 'wishlist' array in sync
            }
        } catch (error) {
            console.error("Error adding to wishlist:", error);
            toast.error("Failed to add product to wishlist");
        }
    }, [userToken, getWishlist]);

    const removeFromWishlist = useCallback(async (productId) => {
        if (!userToken) return;
        try {
            const { data } = await axios.delete(
                `https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`,
                { headers: { token: userToken } }
            );
            if (data && data.status === "success") {
                toast.success(data.message || "Product removed from wishlist", {
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
                setWishlistIds(prev => {
                    const next = new Set(prev);
                    next.delete(productId);
                    return next;
                });
                setWishlist(prev => prev.filter(item => (item._id || item.id) !== productId));
            }
        } catch (error) {
            console.error("Error removing from wishlist:", error);
            toast.error("Failed to remove product from wishlist");
        }
    }, [userToken]);

    const value = useMemo(() => ({
        wishlist,
        wishlistIds,
        isLoading,
        addToWishlist,
        removeFromWishlist,
        getWishlist
    }), [wishlist, wishlistIds, isLoading, addToWishlist, removeFromWishlist, getWishlist]);

    return (
        <WishlistContext.Provider value={value}>
            {children}
        </WishlistContext.Provider>
    );
}
