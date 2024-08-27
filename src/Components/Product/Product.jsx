import React, { useContext, useState, useEffect } from 'react';
import RatingStars from '../RatingStars/RatingStars';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../Contexts/AuthContext';
import { addProductToCart } from '../../cartService';
import { addProductToWishlist, isProductInWishlist } from '../../wishlistService';

export default function Product({ product, index }) {
    const { userToken } = useContext(AuthContext);

    // State to track if the product is in the wishlist
    const [isInWishlist, setIsInWishlist] = useState(false);

    // Effect to check if the product is already in the wishlist
    useEffect(() => {
        const checkWishlist = async () => {
            if (userToken) {
                const result = await isProductInWishlist(product._id, userToken);
                setIsInWishlist(result);
            }
        };
        checkWishlist();
    }, [product._id, userToken]);

    // Handle wishlist click
    const handleWishlistClick = async () => {
        await addProductToWishlist(product._id, userToken);
        setIsInWishlist(true); // Update the state after adding to the wishlist
    };

    return (
        <>
            <div key={index} className="max-w-2xl mx-auto">
                <div className="bg-white shadow-md rounded-lg max-w-sm dark:bg-gray-800 dark:border-gray-700 hover:shadow-2xl transition-all duration-500">
                    <Link to={"/productDetails/" + product._id}>
                        <img className="rounded-t-lg p-8" src={product.imageCover} alt={product.title} />
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
