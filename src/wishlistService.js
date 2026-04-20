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

// Function to get the user's wishlist
export async function getWishlist(userToken) {
    const { data } = await axios.get(`https://ecommerce.routemisr.com/api/v1/wishlist`, {
        headers: {
            token: userToken,
        },
    });
    return data;
}

// Function to check if a product is in the wishlist array
export function isProductInWishlistArray(wishlist, productId) {
    if (!Array.isArray(wishlist)) return false;
    return wishlist.some(item => item._id === productId || item.id === productId);
}

// Function to check if a product is in the wishlist (legacy/convenience)
export async function isProductInWishlist(productId, userToken) {
    try {
        const data = await getWishlist(userToken);
        const wishlist = data.data || [];
        return isProductInWishlistArray(wishlist, productId);
    } catch (error) {
        console.error("Error checking wishlist:", error);
        return false;
    }
}
