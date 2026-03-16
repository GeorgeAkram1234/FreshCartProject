import axios from "axios";
import { Bounce, toast } from "react-toastify";

// Function to add a product to the wishlist
export async function addProductToWishlist(productId, userToken) {
    return await axios.post(`https://ecommerce.routemisr.com/api/v1/wishlist`,
    { productId },
    {
        headers: {
            token: userToken,
        },
    });
}

// Function to remove a product from the wishlist
export async function removeProductFromWishlist(productId, userToken) {
    return await axios.delete(`https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`, {
        headers: {
            token: userToken,
        },
    });
}

// Function to fetch the wishlist
export async function getWishlist(userToken) {
    return await axios.get(`https://ecommerce.routemisr.com/api/v1/wishlist`, {
        headers: {
            token: userToken,
        },
    });
}
