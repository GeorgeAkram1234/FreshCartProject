import axios from "axios";
import { Bounce, toast } from "react-toastify";

/**
 * Fetches the user's wishlist.
 * @param {string} userToken - The authentication token.
 * @returns {Promise<Object>} The wishlist data.
 */
export async function getWishlist(userToken) {
    const { data } = await axios.get(`https://ecommerce.routemisr.com/api/v1/wishlist`, {
        headers: {
            token: userToken,
        },
    });
    return data;
}

/**
 * Adds a product to the wishlist.
 * @param {string} productId - The ID of the product to add.
 * @param {string} userToken - The authentication token.
 * @returns {Promise<Object>} The API response data.
 */
export async function addProductToWishlist(productId, userToken) {
    try {
        const { data } = await axios.post(`https://ecommerce.routemisr.com/api/v1/wishlist`,
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
        toast.error("Failed to add product to wishlist");
        throw error;
    }
}

/**
 * Removes a product from the wishlist.
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

        toast.success("Product has been removed successfully", {
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
        toast.error("Failed to remove product from wishlist");
        throw error;
    }
}

/**
 * Utility to check if a product is in a wishlist array.
 * @param {Array} wishlist - The wishlist array.
 * @param {string} productId - The product ID to check.
 * @returns {boolean} True if the product is in the wishlist.
 */
export function isProductInWishlistArray(wishlist, productId) {
    return wishlist?.some(item => item._id === productId || item.id === productId);
}
