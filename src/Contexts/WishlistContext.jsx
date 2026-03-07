import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { toast, Bounce } from 'react-toastify';

export const WishlistContext = createContext();

export default function WishlistContextProvider({ children }) {
    const { userToken } = useContext(AuthContext);
    const [wishlistIds, setWishlistIds] = useState(new Set());
    const [wishlistData, setWishlistData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const getUserWishlist = useCallback(async () => {
        if (!userToken) return;
        setIsLoading(true);
        try {
            const { data } = await axios.get("https://ecommerce.routemisr.com/api/v1/wishlist", { headers: { token: userToken } });
            if (data?.status === "success") {
                setWishlistIds(new Set(data.data.map(i => i._id)));
                setWishlistData(data.data);
            }
        } catch (e) { console.error(e); } finally { setIsLoading(false); }
    }, [userToken]);

    useEffect(() => { getUserWishlist(); }, [getUserWishlist]);

    const toggleWishlist = async (productId) => {
        const isInWishlist = wishlistIds.has(productId);
        const method = isInWishlist ? 'delete' : 'post';
        const url = `https://ecommerce.routemisr.com/api/v1/wishlist${isInWishlist ? '/' + productId : ''}`;
        try {
            const { data } = await axios[method](url, isInWishlist ? { headers: { token: userToken } } : { productId }, { headers: { token: userToken } });
            if (data.status === "success") {
                setWishlistIds(prev => {
                    const next = new Set(prev);
                    isInWishlist ? next.delete(productId) : next.add(productId);
                    return next;
                });
                toast.success(data.message, { position: "top-center", autoClose: 2000, transition: Bounce });
                getUserWishlist(); // Sync full data
            }
        } catch (e) { toast.error("Wishlist update failed"); }
    };

    return (
        <WishlistContext.Provider value={{ wishlistIds, wishlistData, isLoading, toggleWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
}
