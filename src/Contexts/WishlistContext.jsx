/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { toast, Bounce } from 'react-toastify';

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

    const addToWishlist = useCallback(async (productId) => {
        try {
            const { data } = await axios.post(
                `https://ecommerce.routemisr.com/api/v1/wishlist`,
                { productId },
                { headers: { token: userToken } }
            );

            if (data.status === 'success') {
                toast.success(data.message, {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "light",
                    transition: Bounce,
                });
                // Refresh wishlist to get full product objects
                getUserWishlist();
            }
        } catch (error) {
            console.error("Error adding to wishlist:", error);
            toast.error("Failed to add product to wishlist");
        }
    }, [userToken, getUserWishlist]);

    const removeFromWishlist = useCallback(async (productId) => {
        try {
            const { data } = await axios.delete(
                `https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`,
                { headers: { token: userToken } }
            );

            if (data.status === 'success') {
                toast.success(data.message, {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "light",
                    transition: Bounce,
                });
                // Optimistic update
                setWishlist(prev => prev.filter(item => (item._id || item.id) !== productId));
            }
        } catch (error) {
            console.error("Error removing from wishlist:", error);
            toast.error("Failed to remove product from wishlist");
        }
    }, [userToken]);

    return (
        <WishlistContext.Provider value={{ wishlist, wishlistIds, isLoading, addToWishlist, removeFromWishlist, getUserWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
}
