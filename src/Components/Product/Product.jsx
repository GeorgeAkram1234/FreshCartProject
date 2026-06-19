import { useContext, useMemo } from 'react';
import RatingStars from '../RatingStars/RatingStars';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../Contexts/AuthContext';
import { addProductToCart } from '../../cartService';
import { addProductToWishlist, removeProductFromWishlist, getWishlist, isProductInWishlistArray } from '../../wishlistService';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export default function Product({ product }) {
    const { userToken } = useContext(AuthContext);
    const queryClient = useQueryClient();

    // BOLT OPTIMIZATION: Use React Query to fetch and cache wishlist.
    // This deduplicates the wishlist API call when multiple Product components are rendered.
    const { data: wishlist } = useQuery({
        queryKey: ['wishlist', userToken],
        queryFn: () => getWishlist(userToken),
        enabled: !!userToken,
        staleTime: 600000, // 10 minutes
    });

    // Check if the product is in the wishlist using cached data
    const isInWishlist = useMemo(() => isProductInWishlistArray(wishlist, product._id), [wishlist, product._id]);

    // Handle wishlist toggle
    const handleWishlistToggle = async () => {
        if (isInWishlist) {
            await removeProductFromWishlist(product._id, userToken);
        } else {
            await addProductToWishlist(product._id, userToken);
        }
        // Invalidate wishlist query to refetch updated data
        queryClient.invalidateQueries({ queryKey: ['wishlist', userToken] });
    };

    return (
        <div className="max-w-2xl mx-auto h-full">
            <div className="bg-white shadow-md rounded-lg max-w-sm dark:bg-gray-800 dark:border-gray-700 hover:shadow-2xl transition-all duration-500 h-full flex flex-col">
                <Link to={"/productDetails/" + product._id}>
                    <img className="rounded-t-lg p-8" src={product.imageCover} alt={product.title} />
                </Link>
                <div className="px-5 pb-5 flex-grow flex flex-col">
                    <Link to={"/productDetails/" + product._id}>
                        <h3 className="text-gray-900 font-semibold text-xl tracking-tight dark:text-white line-clamp-1">{product.title}</h3>
                    </Link>
                    <p className="line-clamp-2 text-gray-600 dark:text-gray-400">{product.description}</p>
                    <div className="mt-2.5 mb-5">
                        <RatingStars rating={product.ratingsAverage} />
                    </div>
                    <div className="flex items-center justify-between mt-auto">
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">${product.price}</span>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => addProductToCart(product._id, userToken)}
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                                Add to cart
                            </button>
                            <button onClick={handleWishlistToggle} aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}>
                                <i className={`fa-solid fa-heart text-2xl transition-colors duration-300 ${isInWishlist ? 'text-red-500' : 'text-gray-300 hover:text-red-300'}`}></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
