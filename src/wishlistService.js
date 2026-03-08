import axios from "axios";
import { Bounce, toast } from "react-toastify";

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

        return data;
        
    } catch (error) {
        console.error("Error adding product to wishlist:", error);
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

        return data;
    } catch (error) {
        console.error("Error removing product from wishlist:", error);
        throw error;
    }
}

// Function to get the user's wishlist
export async function getWishlist(userToken) {
    try {
        let { data } = await axios.get(`https://ecommerce.routemisr.com/api/v1/wishlist`, {
            headers: {
                token: userToken,
            },
        });

        return data;
    } catch (error) {
        console.error("Error fetching wishlist:", error);
        throw error;
    }
}

// Function to check if a product is in the wishlist (Deprecated: use WishlistContext for better performance)
export async function isProductInWishlist(productId, userToken) {
    try {
        let { data } = await axios.get(`https://ecommerce.routemisr.com/api/v1/wishlist`, {
            headers: {
                token: userToken,
            },
        });

        const wishlist = data.data || [];
        const productInWishlist = wishlist.some(item => item._id === productId);

        return productInWishlist;

    } catch (error) {
        console.error("Error checking wishlist:", error);
        return false;
    }
}
