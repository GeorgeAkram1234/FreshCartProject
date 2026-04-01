/* eslint-disable react/prop-types */
import { createContext, useContext, useMemo, useCallback } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bounce, toast } from "react-toastify";

export const WishlistContext = createContext();

export default function WishlistContextProvider({ children }) {
    const { userToken } = useContext(AuthContext);
    const queryClient = useQueryClient();

    // Fetch wishlist using React Query
    const { data, isLoading } = useQuery({
        queryKey: ["wishlist", userToken],
        queryFn: async () => {
            if (!userToken) return [];
            const { data } = await axios.get("https://ecommerce.routemisr.com/api/v1/wishlist", {
                headers: { token: userToken },
            });
            return data?.data || [];
        },
        enabled: !!userToken,
    });

    const wishlist = useMemo(() => data || [], [data]);

    // Derive a Set of product IDs for O(1) presence checks
    const wishlistIds = useMemo(() => new Set(wishlist.map(item => item._id || item.id)), [wishlist]);

    // Mutation to add a product to the wishlist
    const addMutation = useMutation({
        mutationFn: async (productId) => {
            const { data } = await axios.post(
                "https://ecommerce.routemisr.com/api/v1/wishlist",
                { productId },
                { headers: { token: userToken } }
            );
            return data;
        },
        onSuccess: (data) => {
            toast.success(data.message, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
            // Refetch the full wishlist to keep data consistent
            queryClient.invalidateQueries({ queryKey: ["wishlist", userToken] });
        },
        onError: () => {
            toast.error("Failed to add to wishlist");
        }
    });

    // Mutation to remove a product from the wishlist
    const removeMutation = useMutation({
        mutationFn: async (productId) => {
            const { data } = await axios.delete(
                `https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`,
                { headers: { token: userToken } }
            );
            return data;
        },
        onSuccess: (data) => {
            toast.success(data.message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
            // Refetch to sync state
            queryClient.invalidateQueries({ queryKey: ["wishlist", userToken] });
        },
        onError: () => {
            toast.error("Failed to remove from wishlist");
        }
    });

    const addToWishlist = useCallback((productId) => {
        addMutation.mutate(productId);
    }, [addMutation]);

    const removeFromWishlist = useCallback((productId) => {
        removeMutation.mutate(productId);
    }, [removeMutation]);

    return (
        <WishlistContext.Provider value={{ wishlist, wishlistIds, isLoading, addToWishlist, removeFromWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
}
