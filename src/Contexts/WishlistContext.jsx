import { createContext, useContext, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { toast, Bounce } from 'react-toastify';

export const WishlistContext = createContext();

/* eslint-disable react/prop-types */
export default function WishlistContextProvider({ children }) {
    const { userToken } = useContext(AuthContext);
    const queryClient = useQueryClient();

    // Fetch wishlist data using React Query
    const { data: wishlistData, isLoading } = useQuery({
        queryKey: ['wishlist', userToken],
        queryFn: async () => {
            if (!userToken) return [];
            const { data } = await axios.get('https://ecommerce.routemisr.com/api/v1/wishlist', {
                headers: { token: userToken }
            });
            return data.data || [];
        },
        enabled: !!userToken,
        // Keep data in cache for 5 minutes
        staleTime: 5 * 60 * 1000,
    });

    // Create a Set of wishlist IDs for O(1) lookups in product components
    // This significantly improves performance on product lists
    const wishlistIds = useMemo(() => {
        return new Set(wishlistData?.map(item => item._id || item.id) || []);
    }, [wishlistData]);

    // Mutation to add a product to the wishlist
    const addToWishlistMutation = useMutation({
        mutationFn: async (productId) => {
            const { data } = await axios.post('https://ecommerce.routemisr.com/api/v1/wishlist',
                { productId },
                { headers: { token: userToken } }
            );
            return data;
        },
        onSuccess: (data) => {
            // Invalidate the wishlist query to refetch updated data
            queryClient.invalidateQueries({ queryKey: ['wishlist', userToken] });
            toast.success(data.message || "Product added to wishlist", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                theme: "light",
                transition: Bounce,
            });
        },
        onError: () => {
            toast.error("Failed to add product to wishlist");
        }
    });

    // Mutation to remove a product from the wishlist
    const removeFromWishlistMutation = useMutation({
        mutationFn: async (productId) => {
            const { data } = await axios.delete(`https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`, {
                headers: { token: userToken }
            });
            return data;
        },
        onSuccess: (data) => {
            // Invalidate the wishlist query to refetch updated data
            queryClient.invalidateQueries({ queryKey: ['wishlist', userToken] });
            toast.success(data.message || "Product removed from wishlist", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                theme: "light",
                transition: Bounce,
            });
        },
        onError: () => {
            toast.error("Failed to remove product from wishlist");
        }
    });

    return (
        <WishlistContext.Provider value={{
            wishlist: wishlistData || [],
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
