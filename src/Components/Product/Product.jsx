import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import RatingStars from '../RatingStars/RatingStars';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../Contexts/AuthContext';
import { addProductToCart } from '../../cartService';
import { addProductToWishlist, getWishlist } from '../../wishlistService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const Product = React.memo(({ product }) => {
    const { userToken } = useContext(AuthContext);
    const queryClient = useQueryClient();

    // Use React Query to fetch the entire wishlist once and share it across all Product components
    const { data: wishlist = [] } = useQuery({
        queryKey: ['wishlist', userToken],
        queryFn: () => getWishlist(userToken),
        enabled: !!userToken,
        staleTime: 600000, // 10 minutes cache
    });

    // Check if the product is in the wishlist locally (O(1) after first fetch)
    const isInWishlist = useMemo(() => {
        return wishlist.some(item => (item._id || item.id) === product._id);
    }, [wishlist, product._id]);

    // Mutation for adding a product to the wishlist
    const wishlistMutation = useMutation({
        mutationFn: () => addProductToWishlist(product._id, userToken),
        onSuccess: () => {
            // Invalidate and refetch wishlist to update all Product components
            queryClient.invalidateQueries({ queryKey: ['wishlist', userToken] });
        },
    });

    const handleWishlistClick = () => {
        if (userToken) {
            wishlistMutation.mutate();
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white shadow-md rounded-lg max-w-sm dark:bg-gray-800 dark:border-gray-700 hover:shadow-2xl transition-all duration-500">
                <Link to={"/productDetails/" + product._id}>
                    {/* BOLT OPTIMIZATION: Added loading="lazy" to improve initial page load performance */}
                    <img
                        className="rounded-t-lg p-8"
                        src={product.imageCover}
                        alt={product.title}
                        loading="lazy"
                    />
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
                            onClick={handleWishlistClick}
                            disabled={wishlistMutation.isPending}
                        >
                            <i className={`fa-solid fa-heart text-2xl ${isInWishlist ? 'text-red-500' : 'text-black'} ${wishlistMutation.isPending ? 'opacity-50' : ''}`}></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
});

Product.displayName = 'Product';

Product.propTypes = {
    product: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        title: PropTypes.string,
        description: PropTypes.string,
        imageCover: PropTypes.string,
        ratingsAverage: PropTypes.number,
        price: PropTypes.number,
    }).isRequired,
};

export default Product;
