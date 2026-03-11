import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { addProductToWishlist as addService, removeProductFromWishlist as removeService } from '../wishlistService';

export const WishlistContext = createContext();

/* eslint-disable react/prop-types */
export default function WishlistContextProvider({ children }) {
    const { userToken } = useContext(AuthContext);
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(false);

    const getWishlist = useCallback(async () => {
        if (!userToken) return;
        setLoading(true);
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
            setLoading(false);
        }
    }, [userToken]);

    // Fetch wishlist once on mount or when token changes
    useEffect(() => {
        if (userToken) {
            getWishlist();
        } else {
            setWishlist([]);
        }
    }, [userToken, getWishlist]);

    // O(1) lookup for whether a product is in the wishlist
    const wishlistIds = useMemo(() => new Set(wishlist.map(item => item._id || item.id)), [wishlist]);

    const addToWishlist = async (productId) => {
        const response = await addService(productId, userToken);
        if (response) {
            getWishlist();
        }
    };

    const removeFromWishlist = async (productId) => {
        const response = await removeService(productId, userToken);
        if (response) {
            getWishlist();
        }
    };

    return (
        <WishlistContext.Provider value={{
            wishlist,
            wishlistIds,
            loading,
            addToWishlist,
            removeFromWishlist,
            getWishlist
        }}>
            {children}
        </WishlistContext.Provider>
    );
}
