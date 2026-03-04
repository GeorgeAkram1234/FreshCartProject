import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { toast, Bounce } from 'react-toastify';

export const WishlistContext = createContext();

export default function WishlistContextProvider({ children }) {
    const { userToken } = useContext(AuthContext);
    const [wishlist, setWishlist] = useState([]);
    const [wishlistIds, setWishlistIds] = useState(new Set());
    const [loading, setLoading] = useState(false);

    async function getUserWishlist() {
        if (!userToken) {
            setWishlist([]);
            setWishlistIds(new Set());
            return;
        }
        setLoading(true);
        try {
            const { data } = await axios.get("https://ecommerce.routemisr.com/api/v1/wishlist", {
                headers: { token: userToken },
            });
            if (data && data.status === "success") {
                setWishlist(data.data);
                setWishlistIds(new Set(data.data.map(item => item._id || item.id)));
            }
        } catch (error) {
            console.error("Error fetching wishlist:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (userToken) {
            getUserWishlist();
        }
    }, [userToken]);

    async function addToWishlist(productId) {
        try {
            const { data } = await axios.post(
                `https://ecommerce.routemisr.com/api/v1/wishlist`,
                { productId },
                { headers: { token: userToken } }
            );
            if (data.status === "success") {
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
                await getUserWishlist();
            }
        } catch (error) {
            console.error("Error adding to wishlist:", error);
            toast.error("Failed to add product to wishlist");
        }
    }

    async function removeFromWishlist(productId) {
        try {
            const { data } = await axios.delete(`https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`, {
                headers: { token: userToken },
            });
            if (data.status === "success") {
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
                await getUserWishlist();
            }
        } catch (error) {
            console.error("Error removing from wishlist:", error);
            toast.error("Failed to remove product from wishlist");
        }
    }

    const isInWishlist = (productId) => wishlistIds.has(productId);

    return (
        <WishlistContext.Provider value={{ wishlist, loading, addToWishlist, removeFromWishlist, isInWishlist, getUserWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
}
