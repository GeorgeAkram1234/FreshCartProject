/* eslint-disable react/prop-types */
import { createContext, useEffect, useState, useCallback, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import { addProductToWishlist as apiAdd, removeProductFromWishlist as apiRemove } from "../wishlistService";

export const WishlistContext = createContext();

export default function WishlistContextProvider({ children }) {
    const { userToken } = useContext(AuthContext);
    const [wishlist, setWishlist] = useState([]);
    const [wishlistIds, setWishlistIds] = useState(new Set());
    const [isLoading, setIsLoading] = useState(false);

    /**
     * Fetches the user's wishlist from the API.
     * Centralizing this fetch avoids redundant per-product requests.
     */
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
            if (data && Array.isArray(data.data)) {
                setWishlist(data.data);
                // Using a Set for O(1) membership lookups in Product components
                const ids = new Set(data.data.map(item => item._id));
                setWishlistIds(ids);
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

    /**
     * Adds a product to the wishlist with an optimistic UI update.
     */
    const addToWishlist = async (productId) => {
        if (!userToken) return;

        // Optimistic update: instantly update the heart icon
        setWishlistIds(prev => new Set(prev).add(productId));

        try {
            await apiAdd(productId, userToken);
            await getWishlist(); // Refresh to ensure full product data is present in the wishlist state
        } catch (error) {
            // Rollback on failure
            setWishlistIds(prev => {
                const next = new Set(prev);
                next.delete(productId);
                return next;
            });
        }
    };

    /**
     * Removes a product from the wishlist with an optimistic UI update.
     */
    const removeFromWishlist = async (productId) => {
        if (!userToken) return;

        // Optimistic update: instantly remove from UI
        setWishlistIds(prev => {
            const next = new Set(prev);
            next.delete(productId);
            return next;
        });
        setWishlist(prev => prev.filter(item => item._id !== productId));

        try {
            await apiRemove(productId, userToken);
            await getWishlist(); // Sync with server state
        } catch (error) {
            // Rollback on failure by refetching
            await getWishlist();
        }
    };

    return (
        <WishlistContext.Provider value={{ wishlist, wishlistIds, addToWishlist, removeFromWishlist, isLoading }}>
            {children}
        </WishlistContext.Provider>
    );
}
