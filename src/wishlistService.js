import axios from "axios";
import { Bounce, toast } from "react-toastify";

/**
 * Fetch the user's wishlist.
 * @param {string} userToken - The authentication token.
 * @returns {Promise<Object>} The API response data.
 */
export async function getWishlist(userToken) {
    try {
        const { data } = await axios.get("https://ecommerce.routemisr.com/api/v1/wishlist", {
            headers: {
                token: userToken
            },
        });
        return data;
    } catch (error) {
        console.error("Error fetching wishlist:", error);
        throw error;
    }
}

/**
 * Add a product to the wishlist.
 * @param {string} productId - The ID of the product to add.
 * @param {string} userToken - The authentication token.
 * @returns {Promise<Object>} The API response data.
 */
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

/**
 * Remove a product from the wishlist.
 * @param {string} productId - The ID of the product to remove.
 * @param {string} userToken - The authentication token.
 * @returns {Promise<Object>} The API response data.
 */
export async function removeProductFromWishlist(productId, userToken) {
    try {
        const { data } = await axios.delete(`https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`, {
            headers: {
                token: userToken,
            },
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

        return data;
    } catch (error) {
        console.error("Error removing product from wishlist:", error);
        toast.error("Failed to remove product from wishlist");
        throw error;
    }
}

/**
 * Check if a product exists in a wishlist array.
 * @param {Array} wishlist - The array of product objects in the wishlist.
 * @param {string} productId - The ID of the product to check.
 * @returns {boolean} True if the product is in the wishlist.
 */
export function isProductInWishlistArray(wishlist, productId) {
    if (!Array.isArray(wishlist)) return false;
    return wishlist.some(item => (item._id === productId || item.id === productId));
}
