import { useContext } from 'react';
import RatingStars from '../RatingStars/RatingStars';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../Contexts/AuthContext';
import { addProductToCart } from '../../cartService';
import { addProductToWishlist, removeProductFromWishlist, getWishlist, isProductInWishlistArray } from '../../wishlistService';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export default function Product({ product }) {
    const { userToken } = useContext(AuthContext);
    const queryClient = useQueryClient();

    // BOLT OPTIMIZATION: Use React Query to fetch and cache wishlist data.
    // This deduplicates the N+1 wishlist API calls into a single request shared across all Product instances.
    const { data: wishlist } = useQuery({
        queryKey: ['wishlist', userToken],
        queryFn: () => getWishlist(userToken),
        enabled: !!userToken,
        staleTime: 600000, // Keep wishlist data fresh for 10 minutes
    });

    const isInWishlist = isProductInWishlistArray(wishlist, product._id);

    // Handle wishlist toggle
    const handleWishlistToggle = async () => {
        if (!userToken) return;

        try {
            if (isInWishlist) {
                await removeProductFromWishlist(product._id, userToken);
            } else {
                await addProductToWishlist(product._id, userToken);
            }
            // Invalidate the wishlist query to refetch data and update all Product components
            queryClient.invalidateQueries({ queryKey: ['wishlist', userToken] });
        } catch (error) {
            console.error("Wishlist toggle failed", error);
        }
    };

    return (
        <>
            <div className="max-w-2xl mx-auto">
                <div className="bg-white shadow-md rounded-lg max-w-sm dark:bg-gray-800 dark:border-gray-700 hover:shadow-2xl transition-all duration-500 h-full flex flex-col justify-between">
                    <div>
                        <Link to={"/productDetails/" + product._id}>
                            <img className="rounded-t-lg p-8 w-full h-64 object-contain" src={product.imageCover} alt={product.title} />
                        </Link>
                        <div className="px-5 pb-5">
                            <Link to={"/productDetails/" + product._id}>
                                <h3 className="text-gray-900 font-semibold text-xl tracking-tight dark:text-white line-clamp-1">{product.title}</h3>
                            </Link>
                            <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-400 my-2">{product.description}</p>
                            <RatingStars rating={product.ratingsAverage} />
                        </div>
                    </div>
                    <div className="px-5 pb-5">
                        <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold text-gray-900 dark:text-white">${product.price}</span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => addProductToCart(product._id, userToken)}
                                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                >
                                    Add to cart
                                </button>
                                <button onClick={handleWishlistToggle} className="p-2">
                                    <i className={`fa-solid fa-heart text-2xl transition-colors duration-300 ${isInWishlist ? 'text-red-500' : 'text-gray-400 hover:text-gray-600'}`}></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
