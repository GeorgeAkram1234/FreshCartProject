import { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { Bounce, toast } from 'react-toastify';

export const WishlistContext = createContext();

/* eslint-disable react/prop-types */
export function WishlistContextProvider({ children }) {
    const { userToken } = useContext(AuthContext);
    const [wishlist, setWishlist] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const wishlistIds = useMemo(() => new Set(wishlist.map(item => item._id)), [wishlist]);

    const getUserWishlist = useCallback(async () => {
        if (!userToken) {
            setWishlist([]);
            return;
        }
        setIsLoading(true);
        try {
            const { data } = await axios.get("https://ecommerce.routemisr.com/api/v1/wishlist", {
                headers: { token: userToken }
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

    const addToWishlist = async (productId) => {
        try {
            const { data } = await axios.post(
                `https://ecommerce.routemisr.com/api/v1/wishlist`,
                { productId },
                { headers: { token: userToken } }
            );
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
            // Refetch to keep state in sync
            getUserWishlist();
        } catch (error) {
            console.error("Error adding product to wishlist:", error);
            toast.error("Failed to add product to wishlist.");
        }
    };

    const removeFromWishlist = async (productId) => {
        try {
            await axios.delete(`https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`, {
                headers: { token: userToken },
            });
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
            // Optimistic update or refetch
            setWishlist((prev) => prev.filter(item => item._id !== productId && item.id !== productId));
        } catch (error) {
            console.error("Error removing product from wishlist:", error);
            toast.error("Failed to remove product from wishlist");
        }
    };

    return (
        <WishlistContext.Provider value={{ wishlist, wishlistIds, isLoading, addToWishlist, removeFromWishlist, getUserWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
}
