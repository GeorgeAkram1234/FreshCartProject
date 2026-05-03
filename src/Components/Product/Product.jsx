/* eslint-disable react/prop-types */
import { useContext } from 'react';
import RatingStars from '../RatingStars/RatingStars';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../Contexts/AuthContext';
import { addProductToCart } from '../../cartService';
import { addProductToWishlist, removeProductFromWishlist, getWishlist, isProductInWishlistArray } from '../../wishlistService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export default function Product({ product, index }) {
    const { userToken } = useContext(AuthContext);
    const queryClient = useQueryClient();

    // Fetch wishlist once and share between all Product components via React Query caching
    const { data: wishlist } = useQuery({
        queryKey: ['wishlist', userToken],
        queryFn: () => getWishlist(userToken),
        enabled: !!userToken,
        // Deduplicate requests and keep data fresh for 5 minutes
        staleTime: 5 * 60 * 1000,
    });

    // Determine if this specific product is in the wishlist
    const isInWishlist = isProductInWishlistArray(wishlist, product._id);

    // Mutation for adding to wishlist
    const addMutation = useMutation({
        mutationFn: () => addProductToWishlist(product._id, userToken),
        onSuccess: () => {
            // Invalidate to refetch fresh wishlist data
            queryClient.invalidateQueries({ queryKey: ['wishlist', userToken] });
        }
    });

    // Mutation for removing from wishlist
    const removeMutation = useMutation({
        mutationFn: () => removeProductFromWishlist(product._id, userToken),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wishlist', userToken] });
        }
    });

    // Handle wishlist click (toggle)
    const handleWishlistToggle = async () => {
        if (isInWishlist) {
            removeMutation.mutate();
        } else {
            addMutation.mutate();
        }
    };

    return (
        <>
            <div key={index} className="max-w-2xl mx-auto">
                <div className="bg-white shadow-md rounded-lg max-w-sm dark:bg-gray-800 dark:border-gray-700 hover:shadow-2xl transition-all duration-500 h-full flex flex-col justify-between">
                    <div>
                        <Link to={"/productDetails/" + product._id}>
                            <img
                                className="rounded-t-lg p-8"
                                src={product.imageCover}
                                alt={product.title}
                                loading="lazy" // Performance: Defer off-screen images
                            />
                        </Link>
                        <div className="px-5 pb-5">
                            <Link to={"/productDetails/" + product._id}>
                                <h3 className="text-gray-900 font-semibold text-xl tracking-tight dark:text-white line-clamp-1">{product.title}</h3>
                            </Link>
                            <p className="line-clamp-2">{product.description}</p>
                            <RatingStars rating={product.ratingsAverage} index={index} />
                        </div>
                    </div>
                    <div className="px-5 pb-5">
                        <div className="flex items-center justify-between">
                            <span className="text-3xl font-bold text-gray-900 dark:text-white">${product.price}</span>
                            <button
                                onClick={() => addProductToCart(product._id, userToken)}
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                                Add to cart
                            </button>
                            <button
                                onClick={handleWishlistToggle}
                                disabled={addMutation.isPending || removeMutation.isPending}
                                className="transition-transform active:scale-125"
                                aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                            >
                                <i className={`fa-solid fa-heart text-2xl transition-colors duration-300 ${isInWishlist ? 'text-red-500' : 'text-gray-400 hover:text-red-300'}`}></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
