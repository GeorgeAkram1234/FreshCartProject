import { useContext } from 'react';
import RatingStars from '../RatingStars/RatingStars';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../Contexts/AuthContext';
import { addProductToCart } from '../../cartService';
import { addProductToWishlist, getWishlist, isProductInWishlistArray, removeProductFromWishlist } from '../../wishlistService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

/* eslint-disable react/prop-types */
export default function Product({ product, index }) {
    const { userToken } = useContext(AuthContext);
    const queryClient = useQueryClient();

    // Bolt Optimization: Use React Query to fetch wishlist data and cache it.
    // This avoids N+1 network requests when multiple Product components are rendered.
    const { data: wishlistData } = useQuery({
        queryKey: ['wishlist'],
        queryFn: () => getWishlist(userToken),
        enabled: !!userToken, // Only fetch if user is logged in
    });

    const wishlist = wishlistData?.data || [];
    const isInWishlist = isProductInWishlistArray(wishlist, product._id);

    // Bolt Optimization: Use useMutation for wishlist actions to ensure the UI stays in sync.
    const addToWishlistMutation = useMutation({
        mutationFn: () => addProductToWishlist(product._id, userToken),
        onSuccess: () => {
            // Invalidate and refetch wishlist to update UI
            queryClient.invalidateQueries({ queryKey: ['wishlist'] });
        },
    });

    const removeFromWishlistMutation = useMutation({
        mutationFn: () => removeProductFromWishlist(product._id, userToken),
        onSuccess: () => {
            // Invalidate and refetch wishlist to update UI
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
            <div key={index} className="max-w-2xl mx-auto">
                <div className="bg-white shadow-md rounded-lg max-w-sm dark:bg-gray-800 dark:border-gray-700 hover:shadow-2xl transition-all duration-500">
                    <Link to={"/productDetails/" + product._id}>
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
                                onClick={handleWishlistToggle}
                                disabled={addToWishlistMutation.isPending || removeFromWishlistMutation.isPending}
                            >
                                <i className={`fa-solid fa-heart text-2xl ${isInWishlist ? 'text-red-500' : 'text-black'} ${addToWishlistMutation.isPending || removeFromWishlistMutation.isPending ? 'opacity-50' : ''}`}></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
