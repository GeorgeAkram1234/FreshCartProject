/* eslint-disable react/prop-types */
import { createContext, useContext, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast, Bounce } from 'react-toastify';
import { AuthContext } from './AuthContext';

export const WishlistContext = createContext();

export default function WishlistContextProvider({ children }) {
    const { userToken } = useContext(AuthContext);
    const queryClient = useQueryClient();

    // Fetch Wishlist
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
    });

    // Derive a Set of IDs for O(1) lookups
    const wishlistIds = useMemo(() => {
        if (!wishlistData) return new Set();
        return new Set(wishlistData.map(item => item._id || item.id));
    }, [wishlistData]);

    // Add to Wishlist Mutation
    const addMutation = useMutation({
        mutationFn: async (productId) => {
            const { data } = await axios.post(
                'https://ecommerce.routemisr.com/api/v1/wishlist',
                { productId },
                { headers: { token: userToken } }
            );
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['wishlist', userToken] });
            toast.success(data.message || "Product added to wishlist", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
                transition: Bounce,
            });
        },
        onError: () => {
            toast.error("Failed to add product to wishlist");
        }
    });

    // Remove from Wishlist Mutation
    const removeMutation = useMutation({
        mutationFn: async (productId) => {
            const { data } = await axios.delete(
                `https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`,
                { headers: { token: userToken } }
            );
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['wishlist', userToken] });
            toast.success(data.message || "Product removed from wishlist", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "light",
                transition: Bounce,
            });
        },
        onError: () => {
            toast.error("Failed to remove product from wishlist");
        }
    });

    const addToWishlist = (productId) => addMutation.mutate(productId);
    const removeFromWishlist = (productId) => removeMutation.mutate(productId);

    return (
        <WishlistContext.Provider value={{
            wishlist: wishlistData || [],
            wishlistIds,
            isLoading,
            addToWishlist,
            removeFromWishlist,
            isAdding: addMutation.isPending,
            isRemoving: removeMutation.isPending
        }}>
            {children}
        </WishlistContext.Provider>
    );
}
