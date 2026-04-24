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

        console.log(data);

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
        
    } catch (error) {
        console.error("Error adding product to wishlist:", error);
        toast.error("Failed to add product to wishlist. Please try again.");
    }
}

// Function to fetch the entire wishlist
export async function getWishlist(userToken) {
    if (!userToken) return [];
    try {
        const { data } = await axios.get("https://ecommerce.routemisr.com/api/v1/wishlist", {
            headers: {
                token: userToken,
            },
        });
        return data.data || [];
    } catch (error) {
        console.error("Error fetching wishlist:", error);
        return [];
    }
}

// Function to remove a product from the wishlist
export async function removeProductFromWishlist(productId, userToken) {
    try {
        const { data } = await axios.delete(`https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`, {
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

// Helper function to check if a product exists in a wishlist array
export function isProductInWishlistArray(wishlist, productId) {
    if (!Array.isArray(wishlist)) return false;
    return wishlist.some(item => (item._id === productId || item.id === productId));
}

// Legacy function - kept for compatibility but should be avoided in loops
export async function isProductInWishlist(productId, userToken) {
    const wishlist = await getWishlist(userToken);
    return isProductInWishlistArray(wishlist, productId);
}
