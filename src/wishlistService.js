import axios from "axios";
import { Bounce, toast } from "react-toastify";

// Function to fetch the user's wishlist
export async function getWishlist(userToken) {
    if (!userToken) return [];
    try {
        let { data } = await axios.get(`https://ecommerce.routemisr.com/api/v1/wishlist`, {
            headers: {
                token: userToken,
            },
        });
        // The API returns the items in the 'data' field
        return data.data || [];
    } catch (error) {
        console.error("Error fetching wishlist:", error);
        throw error;
    }
}

// Function to add a product to the wishlist
export async function addProductToWishlist(productId, userToken) {
    try {
        let { data } = await axios.post(`https://ecommerce.routemisr.com/api/v1/wishlist`, 
        { productId }, 
        {
            headers: {
                token: userToken,
            },
        });

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

        return data;
        
    } catch (error) {
        console.error("Error adding product to wishlist:", error);
        toast.error("Failed to add product to wishlist. Please try again.");
        throw error;
    }
}

// Function to remove a product from the wishlist
export async function removeProductFromWishlist(productId, userToken) {
    try {
        let { data } = await axios.delete(`https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`, {
            headers: {
                token: userToken,
            },
        });

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

        return data;

    } catch (error) {
        console.error("Error removing product from wishlist:", error);
        toast.error("Failed to remove product from wishlist. Please try again.");
        throw error;
    }
}

/**
 * Utility to check if a product is in the wishlist array.
 * This is more efficient than calling getWishlist repeatedly.
 */
export function isProductInWishlistArray(wishlist, productId) {
    if (!wishlist || !Array.isArray(wishlist)) return false;
    return wishlist.some(item => (item._id === productId || item.id === productId));
}

// Function to check if a product is in the wishlist (legacy support)
export async function isProductInWishlist(productId, userToken) {
    try {
        const wishlist = await getWishlist(userToken);
        return isProductInWishlistArray(wishlist, productId);
    } catch (error) {
        console.error("Error checking wishlist:", error);
        return false;
    }
}
