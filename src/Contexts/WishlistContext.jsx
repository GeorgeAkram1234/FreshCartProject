/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import { Bounce, toast } from "react-toastify";

export const WishlistContext = createContext();

/**
 * WishlistContext provides global state for the user's wishlist.
 *
 * PERFORMANCE OPTIMIZATION:
 * Previously, every Product component performed an individual API call to check if it was in the wishlist.
 * This resulted in O(N) redundant network requests on pages with many products.
 *
 * This context fetches the wishlist ONCE (O(1) network) and provides an O(1) lookup via a Set (wishlistIds).
 * This reduces total network traffic by up to 98% on a typical page with 50 products.
 */
export default function WishlistContextProvider({ children }) {
    const { userToken } = useContext(AuthContext);
    const [wishlist, setWishlist] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const getUserWishlist = useCallback(async () => {
        if (!userToken) {
            setWishlist([]);
            setIsLoading(false);
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

    const wishlistIds = useMemo(() => new Set(wishlist.map(item => item._id || item.id)), [wishlist]);

    const isInWishlist = useCallback((productId) => {
        return wishlistIds.has(productId);
    }, [wishlistIds]);

    const addToWishlist = async (productId) => {
        try {
            const { data } = await axios.post(
                `https://ecommerce.routemisr.com/api/v1/wishlist`,
                { productId },
                { headers: { token: userToken } }
            );

            if (data.status === "success") {
                toast.success(data.message, {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: true,
                    transition: Bounce,
                });
                // Optimistic update or just refetch?
                // The API returns the new list of IDs usually, but let's refetch to be safe and consistent with product objects
                getUserWishlist();
            }
        } catch (error) {
            console.error("Error adding to wishlist:", error);
            toast.error("Failed to add to wishlist");
        }
    };

    const removeFromWishlist = async (productId) => {
        try {
            const { data } = await axios.delete(
                `https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`,
                { headers: { token: userToken } }
            );

            if (data.status === "success") {
                toast.success(data.message, {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: true,
                    transition: Bounce,
                });
                getUserWishlist();
            }
        } catch (error) {
            console.error("Error removing from wishlist:", error);
            toast.error("Failed to remove from wishlist");
        }
    };

    return (
        <WishlistContext.Provider value={{
            wishlist,
            wishlistIds,
            isLoading,
            addToWishlist,
            removeFromWishlist,
            isInWishlist,
            getUserWishlist
        }}>
            {children}
        </WishlistContext.Provider>
    );
}
