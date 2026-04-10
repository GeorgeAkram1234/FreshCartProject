/* eslint-disable react/prop-types */
import { createContext, useContext, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import { toast, Bounce } from "react-toastify";

export const WishlistContext = createContext();

export default function WishlistContextProvider({ children }) {
    const { userToken } = useContext(AuthContext);
    const queryClient = useQueryClient();

    // Fetch wishlist data using React Query
    // This centralizes the data and prevents redundant API calls from multiple components
    const { data: wishlistData, isLoading } = useQuery({
        queryKey: ["wishlist", userToken],
        queryFn: async () => {
            if (!userToken) return [];
            const { data } = await axios.get("https://ecommerce.routemisr.com/api/v1/wishlist", {
                headers: { token: userToken },
            });
            return data.data;
        },
        enabled: !!userToken,
        // Keep data fresh but don't over-fetch
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    const wishlist = useMemo(() => wishlistData || [], [wishlistData]);

    // Create a Set of product IDs for O(1) lookup in product cards
    // This is a major performance boost over .find() or .some() in every product card render
    const wishlistIds = useMemo(() => {
        return new Set(wishlist.map(item => item._id || item.id));
    }, [wishlist]);

    const addToWishlistMutation = useMutation({
        mutationFn: async (productId) => {
            const { data } = await axios.post(
                "https://ecommerce.routemisr.com/api/v1/wishlist",
                { productId },
                { headers: { token: userToken } }
            );
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["wishlist", userToken] });
            toast.success(data.message || "Product added to wishlist", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: true,
                theme: "light",
                transition: Bounce,
            });
        },
        onError: () => {
            toast.error("Failed to add product to wishlist");
        }
    });

    const removeFromWishlistMutation = useMutation({
        mutationFn: async (productId) => {
            const { data } = await axios.delete(
                `https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`,
                { headers: { token: userToken } }
            );
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["wishlist", userToken] });
            toast.success(data.message || "Product removed from wishlist", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: true,
                theme: "light",
                transition: Bounce,
            });
        },
        onError: () => {
            toast.error("Failed to remove product from wishlist");
        }
    });

    const toggleWishlist = (productId) => {
        if (wishlistIds.has(productId)) {
            removeFromWishlistMutation.mutate(productId);
        } else {
            addToWishlistMutation.mutate(productId);
        }
    };

    return (
        <WishlistContext.Provider value={{
            wishlist,
            wishlistIds,
            isLoading,
            addToWishlist: addToWishlistMutation.mutate,
            removeFromWishlist: removeFromWishlistMutation.mutate,
            toggleWishlist
        }}>
            {children}
        </WishlistContext.Provider>
    );
}
