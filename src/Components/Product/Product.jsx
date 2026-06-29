import { useContext } from 'react';
import RatingStars from '../RatingStars/RatingStars';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../Contexts/AuthContext';
import { addProductToCart } from '../../cartService';
import { addProductToWishlist, getWishlist } from '../../wishlistService';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export default function Product({ product }) {
    const { userToken } = useContext(AuthContext);
    const queryClient = useQueryClient();

    // BOLT OPTIMIZATION: Use React Query to fetch and cache the wishlist.
    // This deduplicates N individual API calls into 1 request per page load.
    const { data: wishlist = [] } = useQuery({
        queryKey: ['wishlist', userToken],
        queryFn: () => getWishlist(userToken),
        enabled: !!userToken,
    });

    const isInWishlist = wishlist.some(item => item._id === product._id || item.id === product._id);

    // Handle wishlist click
    const handleWishlistClick = async () => {
        await addProductToWishlist(product._id, userToken);
        // Invalidate wishlist query to sync all product cards
        queryClient.invalidateQueries({ queryKey: ['wishlist', userToken] });
    };

    return (
        <>
            <div className="max-w-2xl mx-auto">
                <div className="bg-white shadow-md rounded-lg max-w-sm dark:bg-gray-800 dark:border-gray-700 hover:shadow-2xl transition-all duration-500">
                    <Link to={"/productDetails/" + product._id}>
                        <img className="rounded-t-lg p-8" src={product.imageCover} alt={product.title} loading="lazy" />
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
                            <button onClick={handleWishlistClick}>
                                <i className={`fa-solid fa-heart text-2xl ${isInWishlist ? 'text-red-500' : 'text-black'}`}></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
