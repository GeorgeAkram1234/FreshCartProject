import { createContext, useContext, useMemo } from 'react';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast, Bounce } from 'react-toastify';
import { AuthContext } from './AuthContext';

export const WishlistContext = createContext();

/* eslint-disable react/prop-types */
export default function WishlistContextProvider({ children }) {
    const { userToken } = useContext(AuthContext);
    const queryClient = useQueryClient();

    // Fetch wishlist
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

    // Derive wishlist IDs for O(1) lookup
    const wishlistIds = useMemo(() => {
        return new Set(wishlistData?.map(item => item._id || item.id) || []);
    }, [wishlistData]);

    // Add to wishlist mutation
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
            toast.success(data.message || 'Product added to wishlist', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: true,
                theme: "light",
                transition: Bounce,
            });
        },
        onError: () => {
            toast.error('Failed to add product to wishlist');
        }
    });

    // Remove from wishlist mutation
    const removeMutation = useMutation({
        mutationFn: async (productId) => {
            const { data } = await axios.delete(
                `https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`,
                { headers: { token: userToken } }
            );
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wishlist', userToken] });
            toast.success('Product removed from wishlist', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: true,
                theme: "light",
                transition: Bounce,
            });
        },
        onError: () => {
            toast.error('Failed to remove product from wishlist');
        }
    });

    return (
        <WishlistContext.Provider value={{
            wishlist: wishlistData || [],
            wishlistIds,
            isLoading,
            addToWishlist: addMutation.mutate,
            removeFromWishlist: removeMutation.mutate,
            isAdding: addMutation.isPending,
            isRemoving: removeMutation.isPending
        }}>
            {children}
        </WishlistContext.Provider>
    );
}
