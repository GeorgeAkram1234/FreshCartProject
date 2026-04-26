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

    // ⚡ Bolt Optimization: Use React Query to fetch wishlist.
    // This deduplicates the API call across all Product components on the page.
    const { data: wishlist } = useQuery({
        queryKey: ['wishlist', userToken],
        queryFn: () => getWishlist(userToken),
        enabled: !!userToken,
    });

    const isInWishlist = isProductInWishlistArray(wishlist, product._id);

    const addToWishlistMutation = useMutation({
        mutationFn: () => addProductToWishlist(product._id, userToken),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wishlist', userToken] });
        },
    });

    const removeFromWishlistMutation = useMutation({
        mutationFn: () => removeProductFromWishlist(product._id, userToken),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wishlist', userToken] });
        },
    });

    // Handle wishlist toggle
    const handleWishlistClick = () => {
        if (isInWishlist) {
            removeFromWishlistMutation.mutate();
        } else {
            addToWishlistMutation.mutate();
        }
    };

    return (
        <>
            <div key={index} className="max-w-2xl mx-auto w-full">
                <div className="bg-white shadow-md rounded-lg max-w-sm dark:bg-gray-800 dark:border-gray-700 hover:shadow-2xl transition-all duration-500 h-full flex flex-col">
                    <Link to={"/productDetails/" + product._id}>
                        <img className="rounded-t-lg p-8 w-full h-64 object-contain" src={product.imageCover} alt={product.title} loading="lazy" />
                    </Link>
                    <div className="px-5 pb-5 flex-grow flex flex-col">
                        <Link to={"/productDetails/" + product._id}>
                            <h3 className="text-gray-900 font-semibold text-xl tracking-tight dark:text-white line-clamp-1">{product.title}</h3>
                        </Link>
                        <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-400 mt-2">{product.description}</p>
                        <div className='mt-auto'>
                            <RatingStars rating={product.ratingsAverage} key={index} />
                            <div className="flex items-center justify-between mt-3">
                                <span className="text-2xl font-bold text-gray-900 dark:text-white">${product.price}</span>
                                <div className='flex items-center gap-3'>
                                    <button
                                        onClick={() => addProductToCart(product._id, userToken)}
                                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                    >
                                        Add to cart
                                    </button>
                                    <button onClick={handleWishlistClick} disabled={addToWishlistMutation.isPending || removeFromWishlistMutation.isPending}>
                                        <i className={`fa-solid fa-heart text-2xl transition-colors duration-300 ${isInWishlist ? 'text-red-500' : 'text-gray-300 hover:text-red-300'}`}></i>
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
