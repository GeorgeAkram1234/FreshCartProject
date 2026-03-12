import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { addProductToWishlist as addProductToWishlistApi, removeProductFromWishlist as removeProductFromWishlistApi } from '../wishlistService';
import { toast, Bounce } from 'react-toastify';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const { userToken } = useContext(AuthContext);
    const [wishlist, setWishlist] = useState([]);
    const [wishlistIds, setWishlistIds] = useState(new Set());
    const [isLoading, setIsLoading] = useState(false);

    const fetchWishlist = useCallback(async () => {
        if (!userToken) return;
        setIsLoading(true);
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
            setIsLoading(false);
        }
    }, [userToken]);

    useEffect(() => {
        fetchWishlist();
    }, [fetchWishlist]);

    const addToWishlist = async (product) => {
        if (!userToken) return;

        // Optimistic update
        setWishlistIds(prev => new Set(prev).add(product._id));
        setWishlist(prev => [...prev, product]);

        try {
            await addProductToWishlistApi(product._id, userToken);
        } catch (error) {
            // Rollback on error
            setWishlistIds(prev => {
                const next = new Set(prev);
                next.delete(product._id);
                return next;
            });
            setWishlist(prev => prev.filter(item => item._id !== product._id));
        }
    };

    const removeFromWishlist = async (productId) => {
        if (!userToken) return;

        // Optimistic update
        setWishlistIds(prev => {
            const next = new Set(prev);
            next.delete(productId);
            return next;
        });
        setWishlist(prev => prev.filter(item => item._id !== productId));

        try {
            await removeProductFromWishlistApi(productId, userToken);
            toast.success("Product removed from wishlist successfully", {
                position: "top-right",
                autoClose: 5000,
                transition: Bounce,
            });
        } catch (error) {
            // Rollback on error
            console.error("Error removing from wishlist:", error);
            toast.error("Failed to remove product from wishlist");
            fetchWishlist(); // Re-fetch to restore state
        }
    };

    const isInWishlist = (productId) => wishlistIds.has(productId);

    return (
        <WishlistContext.Provider value={{ wishlist, wishlistIds, isLoading, addToWishlist, removeFromWishlist, isInWishlist, fetchWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};
