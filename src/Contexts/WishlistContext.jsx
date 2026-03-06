import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { Bounce, toast } from 'react-toastify';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const { userToken } = useContext(AuthContext);
    const [wishlist, setWishlist] = useState([]);
    const [wishlistIds, setWishlistIds] = useState(new Set());
    const [loading, setLoading] = useState(false);

    const getWishlist = useCallback(async () => {
        if (!userToken) {
            setWishlist([]);
            setWishlistIds(new Set());
            return;
        }
        setLoading(true);
        try {
            const { data } = await axios.get("https://ecommerce.routemisr.com/api/v1/wishlist", {
                headers: { token: userToken },
            });
            if (data && Array.isArray(data.data)) {
                setWishlist(data.data);
                setWishlistIds(new Set(data.data.map(item => item._id)));
            }
        } catch (error) {
            console.error("Error fetching wishlist:", error);
        } finally {
            setLoading(false);
        }
    }, [userToken]);

    useEffect(() => {
        getWishlist();
    }, [userToken, getWishlist]);

    const addToWishlist = useCallback(async (productId) => {
        if (!userToken) return;
        try {
            const { data } = await axios.post(
                `https://ecommerce.routemisr.com/api/v1/wishlist`,
                { productId },
                { headers: { token: userToken } }
            );

            setWishlistIds(prev => new Set(prev).add(productId));
            getWishlist(); // Refresh full data to keep everything in sync

            toast.success(data.message, {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
        } catch (error) {
            console.error("Error adding to wishlist:", error);
            toast.error("Failed to add to wishlist");
        }
    }, [userToken, getWishlist]);

    const removeFromWishlist = useCallback(async (productId) => {
        if (!userToken) return;
        try {
            await axios.delete(`https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`, {
                headers: { token: userToken },
            });

            const newIds = new Set(wishlistIds);
            newIds.delete(productId);
            setWishlistIds(newIds);
            setWishlist(prev => prev.filter(item => item._id !== productId));

            toast.success("Product removed from wishlist", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
        } catch (error) {
            console.error("Error removing from wishlist:", error);
            toast.error("Failed to remove from wishlist");
        }
    }, [userToken, wishlistIds]);

    const contextValue = useMemo(() => ({
        wishlist,
        wishlistIds,
        addToWishlist,
        removeFromWishlist,
        loading,
        getWishlist
    }), [wishlist, wishlistIds, loading, addToWishlist, removeFromWishlist, getWishlist]);

    return (
        <WishlistContext.Provider value={contextValue}>
            {children}
        </WishlistContext.Provider>
    );
};
