/* eslint-disable react/prop-types */
import { createContext, useContext, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { toast, Bounce } from 'react-toastify';

export const WishlistContext = createContext();

/**
 * WishlistContextProvider manages the user's wishlist state globally.
 * Optimization: Uses react-query to cache the wishlist and provides a Set of IDs for O(1) lookup.
 * This eliminates the N+1 API call problem where each Product component fetched the full wishlist.
 */
export default function WishlistContextProvider({ children }) {
    const { userToken } = useContext(AuthContext);
    const queryClient = useQueryClient();

    // Fetch wishlist from API
    const fetchWishlist = async () => {
        if (!userToken) return [];
        const { data } = await axios.get("https://ecommerce.routemisr.com/api/v1/wishlist", {
            headers: { token: userToken }
        });
        return data.data || [];
    };

    const { data: wishlist = [], isLoading } = useQuery({
        queryKey: ['wishlist', userToken],
        queryFn: fetchWishlist,
        enabled: !!userToken,
        // Keep data fresh but don't over-fetch
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    // Create a Set of IDs for efficient O(1) lookup in Product components
    const wishlistIds = useMemo(() => {
        return new Set(wishlist.map(item => item._id || item.id));
    }, [wishlist]);

    // Mutation to add product to wishlist
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
            queryClient.invalidateQueries({ queryKey: ['wishlist', userToken] });
            toast.success(data.message || "Added to wishlist", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                theme: "light",
                transition: Bounce,
            });
        },
        onError: () => {
            toast.error("Failed to add product to wishlist.");
        }
    });

    // Mutation to remove product from wishlist
    const removeFromWishlistMutation = useMutation({
        mutationFn: async (productId) => {
            const { data } = await axios.delete(
                `https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`,
                { headers: { token: userToken } }
            );
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['wishlist', userToken] });
            toast.success(data.message || "Removed from wishlist", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                theme: "light",
                transition: Bounce,
            });
        },
        onError: () => {
            toast.error("Failed to remove product from wishlist.");
        }
    });

    return (
        <WishlistContext.Provider value={{
            wishlist,
            wishlistIds,
            isLoading,
            addToWishlist: addToWishlistMutation.mutate,
            removeFromWishlist: removeFromWishlistMutation.mutate,
            isAdding: addToWishlistMutation.isPending,
            isRemoving: removeFromWishlistMutation.isPending
        }}>
            {children}
        </WishlistContext.Provider>
    );
}
