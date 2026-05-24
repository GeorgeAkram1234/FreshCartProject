import { useContext } from 'react';
import RatingStars from '../RatingStars/RatingStars';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../Contexts/AuthContext';
import { addProductToCart } from '../../cartService';
import { addProductToWishlist, getWishlist, isProductInWishlistArray, removeProductFromWishlist } from '../../wishlistService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

/* eslint-disable react/prop-types */
export default function Product({ product }) {
    const { userToken } = useContext(AuthContext);
    const queryClient = useQueryClient();

    // Use React Query to fetch and cache the wishlist
    // This will be shared across all Product components, deduplicating requests
    const { data: wishlistData } = useQuery({
        queryKey: ['wishlist', userToken],
        queryFn: () => getWishlist(userToken),
        enabled: !!userToken,
        staleTime: 600000, // 10 minutes
    });

    const wishlist = wishlistData?.data || [];
    const isInWishlist = isProductInWishlistArray(wishlist, product._id);

    // Mutation for adding/removing from wishlist
    const wishlistMutation = useMutation({
        mutationFn: async () => {
            if (isInWishlist) {
                return removeProductFromWishlist(product._id, userToken);
            } else {
                return addProductToWishlist(product._id, userToken);
            }
        },
        onSuccess: () => {
            // Invalidate the wishlist query to refetch the updated list
            queryClient.invalidateQueries({ queryKey: ['wishlist', userToken] });
        },
    });

    return (
        <>
            <div className="max-w-2xl mx-auto">
                <div className="bg-white shadow-md rounded-lg max-w-sm dark:bg-gray-800 dark:border-gray-700 hover:shadow-2xl transition-all duration-500">
                    <Link to={"/productDetails/" + product._id}>
                        <img loading="lazy" className="rounded-t-lg p-8" src={product.imageCover} alt={product.title} />
                    </Link>
                    <div className="px-5 pb-5">
                        <Link to={"/productDetails/" + product._id}>
                            <h3 className="text-gray-900 font-semibold text-xl tracking-tight dark:text-white line-clamp-1">{product.title}</h3>
                        </Link>
                        <p className="line-clamp-2">{product.description}</p>
                        <RatingStars rating={product.ratingsAverage} />
                        <div className="flex items-center justify-between">
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
                                className="p-2"
                            >
                                <i className={`fa-solid fa-heart text-2xl transition-colors duration-300 ${isInWishlist ? 'text-red-500' : 'text-black dark:text-white'}`}></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
