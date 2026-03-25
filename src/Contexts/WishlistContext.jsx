/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { AuthContext } from "./AuthContext";
import { getWishlist, addProductToWishlist, removeProductFromWishlist } from "../wishlistService";

export const WishlistContext = createContext();

export default function WishlistContextProvider({ children }) {
    const { userToken } = useContext(AuthContext);
    const [wishlist, setWishlist] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // useMemo for O(1) lookup performance in Product components
    const wishlistIds = useMemo(() => new Set(wishlist.map(item => item._id)), [wishlist]);

    const getUserWishlist = useCallback(async () => {
        if (!userToken) {
            setWishlist([]);
            return;
        }
        setIsLoading(true);
        try {
            const data = await getWishlist(userToken);
            if (data && Array.isArray(data.data)) {
                setWishlist(data.data);
            }
        } catch (error) {
            console.error("Error fetching wishlist in context:", error);
        } finally {
            setIsLoading(false);
        }
    }, [userToken]);

    const addToWishlist = async (productId) => {
        if (!userToken) return;
        try {
            const data = await addProductToWishlist(productId, userToken);
            if (data.status === "success") {
                // Refetch to get the full product object for the wishlist page
                getUserWishlist();
            }
        } catch (error) {
            console.error("Error adding to wishlist in context:", error);
        }
    };

    const removeFromWishlist = async (productId) => {
        if (!userToken) return;
        try {
            const data = await removeProductFromWishlist(productId, userToken);
            if (data.status === "success") {
                // Optimistic update for the UI
                setWishlist(prev => prev.filter(item => item._id !== productId));
            }
        } catch (error) {
            console.error("Error removing from wishlist in context:", error);
        }
    };

    useEffect(() => {
        getUserWishlist();
    }, [getUserWishlist]);

    return (
        <WishlistContext.Provider value={{ wishlist, wishlistIds, addToWishlist, removeFromWishlist, getUserWishlist, isLoading }}>
            {children}
        </WishlistContext.Provider>
    );
}
