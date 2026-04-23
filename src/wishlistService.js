import axios from "axios";
import { Bounce, toast } from "react-toastify";

// Function to fetch the user's wishlist
export async function getWishlist(userToken) {
    if (!userToken) return { data: [] };
    const { data } = await axios.get(`https://ecommerce.routemisr.com/api/v1/wishlist`, {
        headers: {
            token: userToken,
        },
    });
    return data;
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
        toast.error("Failed to remove product from wishlist", {
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
    }
}

// Function to check if a product is in the wishlist
// This is now deprecated in favor of isProductInWishlistArray when using React Query for the whole list
export async function isProductInWishlist(productId, userToken) {
    try {
        const data = await getWishlist(userToken);
        const wishlist = data.data || [];
        return wishlist.some(item => item._id === productId || item.id === productId);
    } catch (error) {
        console.error("Error checking wishlist:", error);
        return false;
    }
}

// Helper function to check if a product exists in the wishlist array
export function isProductInWishlistArray(wishlist, productId) {
    if (!Array.isArray(wishlist)) return false;
    return wishlist.some(item => item._id === productId || item.id === productId);
}
