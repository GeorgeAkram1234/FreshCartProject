import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { addProductToWishlist as addToWishlistApi, removeProductFromWishlist as removeFromWishlistApi } from '../wishlistService';

export const WishlistContext = createContext();

export function WishlistProvider({ children }) {
    const { userToken } = useContext(AuthContext);
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchWishlist = useCallback(async () => {
        if (!userToken) return;
        setLoading(true);
        try {
            const { data } = await axios.get("https://ecommerce.routemisr.com/api/v1/wishlist", {
                headers: { token: userToken }
            });
            if (data && Array.isArray(data.data)) {
                setWishlistItems(data.data);
            }
        } catch (error) {
            console.error("Error fetching wishlist:", error);
        } finally {
            setLoading(false);
        }
    }, [userToken]);

    useEffect(() => {
        fetchWishlist();
    }, [fetchWishlist]);

    // Use a Set for O(1) membership checks
    const wishlistIdSet = useMemo(() => new Set(wishlistItems.map(item => item._id)), [wishlistItems]);

    const addToWishlist = async (product) => {
        if (!userToken) return;

        try {
            await addToWishlistApi(product._id, userToken);
            // Re-fetch to get the full updated wishlist from server
            await fetchWishlist();
        } catch (error) {
            console.error("Failed to add to wishlist", error);
        }
    };

    const removeFromWishlist = async (productId) => {
        if (!userToken) return;

        // Optimistic update
        const previousWishlist = [...wishlistItems];
        setWishlistItems(prev => prev.filter(item => item._id !== productId));

        try {
            await removeFromWishlistApi(productId, userToken);
        } catch (error) {
            setWishlistItems(previousWishlist);
            console.error("Failed to remove from wishlist", error);
        }
    };

    const isInWishlist = (productId) => {
        return wishlistIdSet.has(productId);
    };

    return (
        <WishlistContext.Provider value={{
            wishlistItems,
            isInWishlist,
            addToWishlist,
            removeFromWishlist,
            loading,
            refreshWishlist: fetchWishlist
        }}>
            {children}
        </WishlistContext.Provider>
    );
}
