import { useContext } from 'react';
import RatingStars from '../RatingStars/RatingStars';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../Contexts/AuthContext';
import { addProductToCart } from '../../cartService';
import { addProductToWishlist, getWishlist } from '../../wishlistService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export default function Product({ product }) {
    const { userToken } = useContext(AuthContext);
    const queryClient = useQueryClient();

    // BOLT OPTIMIZATION: Use React Query to fetch and cache the wishlist.
    // This prevents N+1 fetch requests when multiple Product components are rendered.
    // The query key ['wishlist', userToken] ensures all Product components share the same cache.
    const { data: wishlist = [] } = useQuery({
        queryKey: ['wishlist', userToken],
        queryFn: () => getWishlist(userToken),
        enabled: !!userToken,
        staleTime: 10 * 60 * 1000, // Keep data fresh for 10 minutes
    });

    const isInWishlist = wishlist.some(item => (item.id || item._id) === product._id);

    const mutation = useMutation({
        mutationFn: () => addProductToWishlist(product._id, userToken),
        onSuccess: () => {
            // Invalidate and refetch wishlist to update UI globally
            queryClient.invalidateQueries({ queryKey: ['wishlist', userToken] });
        },
    });

    // Handle wishlist click
    const handleWishlistClick = () => {
        if (userToken) {
            mutation.mutate();
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white shadow-md rounded-lg max-w-sm dark:bg-gray-800 dark:border-gray-700 hover:shadow-2xl transition-all duration-500 h-full flex flex-col">
                <Link to={"/productDetails/" + product._id}>
                    <img className="rounded-t-lg p-8" src={product.imageCover} alt={product.title} loading="lazy" />
                </Link>
                <div className="px-5 pb-5 flex-grow">
                    <Link to={"/productDetails/" + product._id}>
                        <h3 className="text-gray-900 font-semibold text-xl tracking-tight dark:text-white line-clamp-1">{product.title}</h3>
                    </Link>
                    <p className="line-clamp-2">{product.description}</p>
                    <RatingStars rating={product.ratingsAverage} />
                    <div className="flex items-center justify-between mt-4">
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">${product.price}</span>
                        <button
                            onClick={() => addProductToCart(product._id, userToken)}
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                            Add to cart
                        </button>
                        <button onClick={handleWishlistClick} disabled={mutation.isPending}>
                            <i className={`fa-solid fa-heart text-2xl ${isInWishlist ? 'text-red-500' : 'text-black'} ${mutation.isPending ? 'opacity-50' : ''}`}></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
