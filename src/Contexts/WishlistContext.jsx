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

    const { data: wishlistData, isLoading } = useQuery({
        queryKey: ["wishlist", userToken],
        queryFn: async () => {
            if (!userToken) return [];
            const { data } = await axios.get("https://ecommerce.routemisr.com/api/v1/wishlist", {
                headers: { token: userToken },
            });
            return data.data || [];
        },
        enabled: !!userToken,
    });

    // Memoize the set of wishlist IDs for O(1) lookups in product components
    const wishlistIds = useMemo(() => {
        return new Set(wishlistData?.map((item) => item._id || item.id) || []);
    }, [wishlistData]);

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
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
        },
        onError: () => {
            toast.error("Failed to add product to wishlist");
        },
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
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
        },
        onError: () => {
            toast.error("Failed to remove product from wishlist");
        },
    });

    return (
        <WishlistContext.Provider
            value={{
                wishlistData,
                wishlistIds,
                isLoading,
                addToWishlist: addToWishlistMutation.mutate,
                removeFromWishlist: removeFromWishlistMutation.mutate,
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
}
