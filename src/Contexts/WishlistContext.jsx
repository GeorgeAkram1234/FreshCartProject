import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from './AuthContext';
import { addProductToWishlist, removeProductFromWishlist, getUserWishlist } from '../wishlistService';

export const WishlistContext = createContext();

export function WishlistProvider({ children }) {
    const { userToken } = useContext(AuthContext);
    const [wishlist, setWishlist] = useState([]);
    const [wishlistIds, setWishlistIds] = useState(new Set());
    const [isLoading, setIsLoading] = useState(false);

    const getWishlist = useCallback(async () => {
        if (!userToken) return;
        setIsLoading(true);
        try {
            const data = await getUserWishlist(userToken);
            if (data && Array.isArray(data.data)) {
                setWishlist(data.data);
                setWishlistIds(new Set(data.data.map(item => item._id)));
            }
        } catch (error) {
            console.error("Error fetching wishlist:", error);
        } finally {
            setIsLoading(false);
        }
    }, [userToken]);

    const addToWishlist = async (productId) => {
        if (!userToken) return;

        // Optimistic UI update
        setWishlistIds(prev => {
            const newSet = new Set(prev);
            newSet.add(productId);
            return newSet;
        });

        try {
            const data = await addProductToWishlist(productId, userToken);
            if (data.status === "success") {
                getWishlist();
            } else {
                // Rollback if failed
                setWishlistIds(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(productId);
                    return newSet;
                });
            }
        } catch (error) {
            // Rollback if error
            setWishlistIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(productId);
                return newSet;
            });
        }
    };

    const removeFromWishlist = async (productId) => {
        if (!userToken) return;

        // Optimistic UI update
        setWishlistIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(productId);
            return newSet;
        });
        setWishlist(prev => prev.filter(item => item._id !== productId));

        try {
            const data = await removeProductFromWishlist(productId, userToken);
            if (data.status === "success") {
                getWishlist();
            } else {
                // Rollback if failed
                getWishlist();
            }
        } catch (error) {
            // Rollback if error
            getWishlist();
        }
    };

    useEffect(() => {
        if (userToken) {
            getWishlist();
        } else {
            setWishlist([]);
            setWishlistIds(new Set());
        }
    }, [userToken, getWishlist]);

    return (
        <WishlistContext.Provider value={{ wishlist, wishlistIds, addToWishlist, removeFromWishlist, isLoading, getWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
}
