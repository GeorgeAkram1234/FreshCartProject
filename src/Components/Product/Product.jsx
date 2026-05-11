import { useContext } from 'react';
import RatingStars from '../RatingStars/RatingStars';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../Contexts/AuthContext';
import { addProductToCart } from '../../cartService';
import { addProductToWishlist, getWishlist, isProductInWishlistArray, removeProductFromWishlist } from '../../wishlistService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

/* eslint-disable react/prop-types */

export default function Product({ product }) {
    const { userToken } = useContext(AuthContext);
    const queryClient = useQueryClient();

    // Use React Query to fetch/get the wishlist data
    // This will be shared across all Product components, solving the N+1 problem
    const { data: wishlistData } = useQuery({
        queryKey: ['wishlist'],
        queryFn: () => getWishlist(userToken),
        enabled: !!userToken,
        select: (data) => data.data, // Standardize on the data array
    });

    // Check if the product is in the wishlist using the cached data
    const isInWishlist = isProductInWishlistArray(wishlistData, product._id);

    // Mutation for adding to wishlist
    const addMutation = useMutation({
        mutationFn: () => addProductToWishlist(product._id, userToken),
        onSuccess: () => {
            // Invalidate and refetch wishlist to ensure UI is in sync
            queryClient.invalidateQueries({ queryKey: ['wishlist'] });
        },
    });

    // Mutation for removing from wishlist
    const removeMutation = useMutation({
        mutationFn: () => removeProductFromWishlist(product._id, userToken),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wishlist'] });
        },
    });

    const handleWishlistToggle = () => {
        if (isInWishlist) {
            removeMutation.mutate();
        } else {
            addMutation.mutate();
        }
    };

    return (
        <>
            <div className="max-w-2xl mx-auto">
                <div className="bg-white shadow-md rounded-lg max-w-sm dark:bg-gray-800 dark:border-gray-700 hover:shadow-2xl transition-all duration-500 h-full flex flex-col">
                    <Link to={"/productDetails/" + product._id}>
                        <img className="rounded-t-lg p-8" src={product.imageCover} alt={product.title} loading="lazy" />
                    </Link>
                    <div className="px-5 pb-5 flex flex-col flex-grow">
                        <Link to={"/productDetails/" + product._id}>
                            <h3 className="text-gray-900 font-semibold text-xl tracking-tight dark:text-white line-clamp-1">{product.title}</h3>
                        </Link>
                        <p className="line-clamp-2 text-gray-700 dark:text-gray-300 mb-2">{product.description}</p>
                        <div className="mt-auto">
                            <RatingStars rating={product.ratingsAverage} />
                            <div className="flex items-center justify-between mt-4">
                                <span className="text-2xl font-bold text-gray-900 dark:text-white">${product.price}</span>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => addProductToCart(product._id, userToken)}
                                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                    >
                                        Add to cart
                                    </button>
                                    <button
                                        onClick={handleWishlistToggle}
                                        disabled={addMutation.isPending || removeMutation.isPending}
                                        className="focus:outline-none"
                                        aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                                    >
                                        <i className={`fa-solid fa-heart text-2xl transition-colors duration-300 ${isInWishlist ? 'text-red-500' : 'text-gray-400 hover:text-red-300'}`}></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
