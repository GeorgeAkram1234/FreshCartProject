import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from './AuthContext';
import { Bounce, toast } from 'react-toastify';
import { getWishlist, addProductToWishlist, removeProductFromWishlist } from '../wishlistService';

export const WishlistContext = createContext();

/* eslint-disable react/prop-types */
export default function WishlistContextProvider({ children }) {
    const { userToken } = useContext(AuthContext);
    const [wishlistIds, setWishlistIds] = useState(new Set());
    const [wishlistData, setWishlistData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const getUserWishlist = useCallback(async () => {
        if (!userToken) return;
        setIsLoading(true);
        try {
            const { data } = await getWishlist(userToken);
            if (data && data.status === 'success') {
                const ids = new Set(data.data.map(item => item._id));
                setWishlistIds(ids);
                setWishlistData(data.data);
            }
        } catch (error) {
            console.error("Error fetching wishlist:", error);
        } finally {
            setIsLoading(false);
        }
    }, [userToken]);

    useEffect(() => {
        if (userToken) {
            getUserWishlist();
        } else {
            setWishlistIds(new Set());
            setWishlistData([]);
        }
    }, [userToken, getUserWishlist]);

    const addToWishlist = async (productId) => {
        try {
            const { data } = await addProductToWishlist(productId, userToken);
            if (data.status === 'success') {
                setWishlistIds(prev => new Set(prev).add(productId));
                getUserWishlist();
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
            }
        } catch (error) {
            toast.error("Failed to add product to wishlist");
        }
    };

    const removeFromWishlist = async (productId) => {
        try {
            const { data } = await removeProductFromWishlist(productId, userToken);
            if (data.status === 'success') {
                setWishlistIds(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(productId);
                    return newSet;
                });
                setWishlistData(prev => prev.filter(item => item._id !== productId));
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
            }
        } catch (error) {
            toast.error("Failed to remove product from wishlist");
        }
    };

    return (
        <WishlistContext.Provider value={{
            wishlistIds,
            wishlistData,
            isLoading,
            addToWishlist,
            removeFromWishlist,
            getUserWishlist
        }}>
            {children}
        </WishlistContext.Provider>
    );
}
