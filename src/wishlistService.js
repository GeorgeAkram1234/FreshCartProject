import axios from "axios";
import { Bounce, toast } from "react-toastify";

const BASE_URL = "https://ecommerce.routemisr.com/api/v1/wishlist";

// Function to fetch the user's wishlist
export async function getWishlist(userToken) {
    if (!userToken) return [];
    try {
        const { data } = await axios.get(BASE_URL, {
            headers: { token: userToken },
        });
        return data.data || [];
    } catch (error) {
        console.error("Error fetching wishlist:", error);
        throw error;
    }
}

// Function to add a product to the wishlist
export async function addProductToWishlist(productId, userToken) {
    if (!userToken) return;
    try {
        let { data } = await axios.post(BASE_URL,
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
    if (!userToken) return;
    try {
        const { data } = await axios.delete(`${BASE_URL}/${productId}`, {
            headers: {
                token: userToken,
            },
        });

        toast.success(data.message || "Product removed from wishlist successfully", {
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

// Helper to check if a product is in a wishlist array
export function isProductInWishlistArray(wishlist, productId) {
    if (!wishlist || !Array.isArray(wishlist)) return false;
    return wishlist.some(item => item._id === productId || item.id === productId);
}

// Legacy function to check if a product is in the wishlist (triggers API call)
// DEPRECATED: Use React Query and isProductInWishlistArray instead to avoid N+1 requests
export async function isProductInWishlist(productId, userToken) {
    try {
        const wishlist = await getWishlist(userToken);
        return isProductInWishlistArray(wishlist, productId);
    } catch (error) {
        return false;
    }
}
