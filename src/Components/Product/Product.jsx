import { useContext } from 'react';
import RatingStars from '../RatingStars/RatingStars';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../Contexts/AuthContext';
import { addProductToCart } from '../../cartService';
import { addProductToWishlist, removeProductFromWishlist, getWishlist, isProductInWishlistArray } from '../../wishlistService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

/* eslint-disable react/prop-types */

export default function Product({ product }) {
    const { userToken } = useContext(AuthContext);
    const queryClient = useQueryClient();

    // Use React Query to fetch and cache the wishlist.
    // This deduplicates the request across all Product instances.
    const { data: wishlistData } = useQuery({
        queryKey: ['wishlist'],
        queryFn: () => getWishlist(userToken),
        enabled: !!userToken,
        staleTime: 600000, // Cache wishlist for 10 minutes to reduce network overhead
    });

    const isInWishlist = isProductInWishlistArray(wishlistData?.data, product._id);

    // Mutation for adding to wishlist
    const addToWishlistMutation = useMutation({
        mutationFn: () => addProductToWishlist(product._id, userToken),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wishlist'] });
        },
    });

    // Mutation for removing from wishlist
    const removeFromWishlistMutation = useMutation({
        mutationFn: () => removeProductFromWishlist(product._id, userToken),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wishlist'] });
        },
    });

    // Handle wishlist toggle
    const handleWishlistToggle = () => {
        if (isInWishlist) {
            removeFromWishlistMutation.mutate();
        } else {
            addToWishlistMutation.mutate();
        }
    };

    return (
        <>
            <div className="max-w-2xl mx-auto w-full">
                <div className="bg-white shadow-md rounded-lg max-w-sm dark:bg-gray-800 dark:border-gray-700 hover:shadow-2xl transition-all duration-500">
                    <Link to={"/productDetails/" + product._id}>
                        <img
                            className="rounded-t-lg p-8"
                            src={product.imageCover}
                            alt={product.title}
                            loading="lazy" // Performance: Deferred loading of off-screen images
                        />
                    </Link>
                    <div className="px-5 pb-5">
                        <Link to={"/productDetails/" + product._id}>
                            <h3 className="text-gray-900 font-semibold text-xl tracking-tight dark:text-white line-clamp-1">{product.title}</h3>
                        </Link>
                        <p className="line-clamp-2">{product.description}</p>
                        <RatingStars rating={product.ratingsAverage} />
                        <div className="flex items-center justify-between mt-3">
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
                                    disabled={addToWishlistMutation.isPending || removeFromWishlistMutation.isPending}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <i className={`fa-solid fa-heart text-2xl ${isInWishlist ? 'text-red-500' : 'text-gray-400'}`}></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
