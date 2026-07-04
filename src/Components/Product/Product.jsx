import { useContext } from 'react';
import RatingStars from '../RatingStars/RatingStars';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../Contexts/AuthContext';
import { addProductToCart } from '../../cartService';
import { addProductToWishlist, getWishlist } from '../../wishlistService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import PropTypes from 'prop-types';

export default function Product({ product }) {
    const { userToken } = useContext(AuthContext);
    const queryClient = useQueryClient();

    // BOLT OPTIMIZATION: Use React Query to fetch and cache wishlist data.
    // This resolves the N+1 problem where each product component was making its own API call.
    const { data: wishlistData } = useQuery({
        queryKey: ['wishlist', userToken],
        queryFn: () => getWishlist(userToken),
        enabled: !!userToken,
        staleTime: 600000, // 10 minutes
    });

    const isInWishlist = wishlistData?.data?.some(item => item._id === product._id);

    const wishlistMutation = useMutation({
        mutationFn: () => addProductToWishlist(product._id, userToken),
        onSuccess: () => {
            // Invalidate and refetch wishlist data
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
            <div className="max-w-2xl mx-auto">
                <div className="bg-white shadow-md rounded-lg max-w-sm dark:bg-gray-800 dark:border-gray-700 hover:shadow-2xl transition-all duration-500">
                    <Link to={"/productDetails/" + product._id}>
                        <img className="rounded-t-lg p-8" src={product.imageCover} alt={product.title} />
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
                            <button onClick={handleWishlistClick} disabled={wishlistMutation.isPending}>
                                <i className={`fa-solid fa-heart text-2xl ${isInWishlist ? 'text-red-500' : 'text-black'}`}></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Product.propTypes = {
    product: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        imageCover: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string,
        ratingsAverage: PropTypes.number,
        price: PropTypes.number.isRequired,
    }).isRequired,
};
