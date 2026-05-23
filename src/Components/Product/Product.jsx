/* eslint-disable react/prop-types */
import { useContext } from 'react';
import RatingStars from '../RatingStars/RatingStars';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../Contexts/AuthContext';
import { addProductToCart } from '../../cartService';
import { addProductToWishlist, getWishlist, isProductInWishlistArray, removeProductFromWishlist } from '../../wishlistService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export default function Product({ product }) {
    const { userToken } = useContext(AuthContext);
    const queryClient = useQueryClient();

    // Use React Query to fetch and cache the wishlist.
    // This deduplicates the network request across all Product components.
    const { data: wishlistData } = useQuery({
        queryKey: ['wishlist', userToken],
        queryFn: () => getWishlist(userToken),
        enabled: !!userToken,
    });

    const isInWishlist = isProductInWishlistArray(wishlistData?.data, product._id);

    // useMutation for adding/removing from wishlist with cache invalidation
    const wishlistMutation = useMutation({
        mutationFn: async () => {
            if (isInWishlist) {
                return removeProductFromWishlist(product._id, userToken);
            } else {
                return addProductToWishlist(product._id, userToken);
            }
        },
        onSuccess: () => {
            // Invalidate and refetch wishlist to keep UI in sync
            queryClient.invalidateQueries({ queryKey: ['wishlist', userToken] });
        },
    });

    return (
        <>
            <div className="max-w-2xl mx-auto h-full">
                <div className="bg-white shadow-md rounded-lg max-w-sm dark:bg-gray-800 dark:border-gray-700 hover:shadow-2xl transition-all duration-500 flex flex-col h-full">
                    <Link to={"/productDetails/" + product._id}>
                        <img className="rounded-t-lg p-8" src={product.imageCover} alt={product.title} loading="lazy" />
                    </Link>
                    <div className="px-5 pb-5">
                        <Link to={"/productDetails/" + product._id}>
                            <h3 className="text-gray-900 font-semibold text-xl tracking-tight dark:text-white line-clamp-1">{product.title}</h3>
                        </Link>
                        <p className="line-clamp-2">{product.description}</p>
                        <RatingStars rating={product.ratingsAverage} />
                        <div className="flex items-center justify-between mt-auto">
                            <span className="text-3xl font-bold text-gray-900 dark:text-white">${product.price}</span>
                            <button
                                onClick={() => addProductToCart(product._id, userToken)}
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                                Add to cart
                            </button>
                            <button
                                onClick={() => wishlistMutation.mutate()}
                                disabled={wishlistMutation.isPending}
                                className="disabled:opacity-50"
                            >
                                <i className={`fa-solid fa-heart text-2xl ${isInWishlist ? 'text-red-500' : 'text-black hover:text-red-300 transition-colors'}`}></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
