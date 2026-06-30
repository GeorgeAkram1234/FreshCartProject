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

        return data;
        
    } catch (error) {
        console.error("Error adding product to wishlist:", error);
        toast.error("Failed to add product to wishlist. Please try again.");
    }
}

// Function to get the user's wishlist
export async function getWishlist(userToken) {
    try {
        const { data } = await axios.get(`https://ecommerce.routemisr.com/api/v1/wishlist`, {
            headers: {
                token: userToken,
            },
        });
        return data.data; // The API returns the wishlist in data.data
    } catch (error) {
        console.error("Error fetching wishlist:", error);
        return [];
    }
}

// Function to check if a product is in the wishlist
export async function isProductInWishlist(productId, userToken) {
    try {
        const wishlist = await getWishlist(userToken);
        const productInWishlist = wishlist.some(item => (item._id || item.id) === productId);
        return productInWishlist;
    } catch (error) {
        console.error("Error checking wishlist:", error);
        return false;
    }
}
