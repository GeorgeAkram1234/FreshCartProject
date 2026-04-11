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
        queryKey: ['wishlist', userToken],
        queryFn: () => axios.get("https://ecommerce.routemisr.com/api/v1/wishlist", {
            headers: { token: userToken }
        }),
        enabled: !!userToken,
        select: (res) => res.data.data,
    });

    const wishlist = useMemo(() => wishlistData || [], [wishlistData]);

    const wishlistIds = useMemo(() => {
        return new Set(wishlist.map(item => item._id || item.id));
    }, [wishlist]);

    const addMutation = useMutation({
        mutationFn: (productId) => axios.post(`https://ecommerce.routemisr.com/api/v1/wishlist`,
            { productId },
            { headers: { token: userToken } }
        ),
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ['wishlist', userToken] });
            toast.success(res.data.message, {
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
    });

    const removeMutation = useMutation({
        mutationFn: (productId) => axios.delete(`https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`, {
            headers: { token: userToken }
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wishlist', userToken] });
            toast.success("Product removed from wishlist successfully", {
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
        },
    });

    return (
        <WishlistContext.Provider value={{
            wishlist,
            wishlistIds,
            isLoading,
            addToWishlist: addMutation.mutate,
            removeFromWishlist: removeMutation.mutate
        }}>
            {children}
        </WishlistContext.Provider>
    );
}
