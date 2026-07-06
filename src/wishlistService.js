import axios from "axios";
import { Bounce, toast } from "react-toastify";

// Function to get the wishlist
export async function getWishlist(userToken) {
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
        throw error;
    }
}

// Function to check if a product is in the wishlist
export async function isProductInWishlist(productId, userToken) {
    try {
        const data = await getWishlist(userToken);

        // Assuming data.data contains an array of wishlist products based on Wishlist.jsx
        const wishlist = data.data || [];

        // Check if the productId exists in the wishlist
        const productInWishlist = wishlist.some(item => item._id === productId);

        return productInWishlist;

    } catch (error) {
        console.error("Error checking wishlist:", error);
        return false; // Return false in case of an error
    }
}
