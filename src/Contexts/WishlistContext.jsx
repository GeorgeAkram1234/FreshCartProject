/* eslint-disable react/prop-types */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { addProductToWishlist as addToWishlistApi, removeProductFromWishlist as removeFromWishlistApi } from '../wishlistService';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const { userToken } = useContext(AuthContext);
    const [wishlist, setWishlist] = useState([]);
    const [wishlistIds, setWishlistIds] = useState(new Set());
    const [isLoading, setIsLoading] = useState(false);

    const fetchWishlist = useCallback(async () => {
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

    const addToWishlist = async (productId) => {
        // Optimistic update
        setWishlistIds(prev => new Set(prev).add(productId));
        try {
            await addToWishlistApi(productId, userToken);
            // Refresh full wishlist data in background to get complete product details
            fetchWishlist();
        } catch (error) {
            // Rollback on error
            setWishlistIds(prev => {
                const next = new Set(prev);
                next.delete(productId);
                return next;
            });
        }
    };

    const removeFromWishlist = async (productId) => {
        // Optimistic update
        setWishlistIds(prev => {
            const next = new Set(prev);
            next.delete(productId);
            return next;
        });
        setWishlist(prev => prev.filter(item => item._id !== productId));

        try {
            await removeFromWishlistApi(productId, userToken);
        } catch (error) {
            // Rollback is complex here without full refetch, so just refetch
            fetchWishlist();
        }
    };

    const isInWishlist = (productId) => wishlistIds.has(productId);

    return (
        <WishlistContext.Provider value={{
            wishlist,
            wishlistIds,
            isLoading,
            addToWishlist,
            removeFromWishlist,
            isInWishlist,
            refreshWishlist: fetchWishlist
        }}>
            {children}
        </WishlistContext.Provider>
    );
};
