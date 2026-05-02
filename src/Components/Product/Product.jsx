/* eslint-disable react/prop-types */
import { useContext } from 'react';
import RatingStars from '../RatingStars/RatingStars';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../Contexts/AuthContext';
import { addProductToCart } from '../../cartService';
import { addProductToWishlist, getWishlist, isProductInWishlistArray } from '../../wishlistService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export default function Product({ product, index }) {
    const { userToken } = useContext(AuthContext);
    const queryClient = useQueryClient();

    // Fetch wishlist data using React Query to deduplicate and cache requests
    const { data: wishlist = [] } = useQuery({
        queryKey: ['wishlist', userToken],
        queryFn: () => getWishlist(userToken),
        enabled: !!userToken,
        staleTime: 1000 * 60 * 5, // 5 minutes cache
    });

    // Determine if this product is in the wishlist
    const isInWishlist = isProductInWishlistArray(wishlist, product._id);

    // Mutation for adding to wishlist
    const wishlistMutation = useMutation({
        mutationFn: () => addProductToWishlist(product._id, userToken),
        onSuccess: () => {
            // Invalidate and refetch wishlist to keep UI in sync
            queryClient.invalidateQueries({ queryKey: ['wishlist', userToken] });
        },
    });

    // Handle wishlist click
    const handleWishlistClick = () => {
        if (userToken) {
            wishlistMutation.mutate();
        }
    };

    return (
        <>
            <div key={index} className="max-w-2xl mx-auto">
                <div className="bg-white shadow-md rounded-lg max-w-sm dark:bg-gray-800 dark:border-gray-700 hover:shadow-2xl transition-all duration-500">
                    <Link to={"/productDetails/" + product._id}>
                        {/* ⚡ Performance optimization: Added loading="lazy" to defer off-screen image loading */}
                        <img className="rounded-t-lg p-8" src={product.imageCover} alt={product.title} loading="lazy" />
                    </Link>
                    <div className="px-5 pb-5">
                        <Link to={"/productDetails/" + product._id}>
                            <h3 className="text-gray-900 font-semibold text-xl tracking-tight dark:text-white line-clamp-1">{product.title}</h3>
                        </Link>
                        <p className="line-clamp-2">{product.description}</p>
                        <RatingStars rating={product.ratingsAverage} key={index} />
                        <div className="flex items-center justify-between">
                            <span className="text-3xl font-bold text-gray-900 dark:text-white">${product.price}</span>
                            <button
                                onClick={() => addProductToCart(product._id, userToken)}
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                                Add to cart
                            </button>
                            <button
                                onClick={handleWishlistClick}
                                disabled={wishlistMutation.isPending}
                                className="transition-transform active:scale-90"
                            >
                                <i className={`fa-solid fa-heart text-2xl ${isInWishlist ? 'text-red-500' : 'text-black opacity-50'} hover:opacity-100 transition-opacity`}></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
