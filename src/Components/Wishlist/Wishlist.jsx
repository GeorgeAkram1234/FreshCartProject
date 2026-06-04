import { useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { addProductToCart } from '../../cartService';
import { Link } from 'react-router-dom';
import LoadingScreen from '../LoadingScreen/LoadingScreen';
import { AuthContext } from '../../Contexts/AuthContext';
import { Helmet } from 'react-helmet';
import { getWishlist, removeProductFromWishlist } from '../../wishlistService';

export default function WishList() {
    const { userToken } = useContext(AuthContext);
    const queryClient = useQueryClient();

    // Use React Query to fetch and cache wishlist data
    const { data, isLoading, isError } = useQuery({
        queryKey: ['wishlist', userToken],
        queryFn: () => getWishlist(userToken),
        enabled: !!userToken,
        staleTime: 600000,
    });

    const wishlist = data?.data || [];

    // Mutation for removing a product from the wishlist
    const removeMutation = useMutation({
        mutationFn: (productId) => removeProductFromWishlist(productId, userToken),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wishlist', userToken] });
        },
    });

    if (isLoading) return <LoadingScreen />;

    if (isError) {
        return (
            <div className="h-screen flex justify-center items-center">
                <h1 className="text-center text-2xl font-semibold text-red-600">Failed to fetch wishlist. Please try again.</h1>
            </div>
        );
    }

    return (
        <>
            <div className="mx-auto container px-4 md:px-6 2xl:px-0 py-12 flex flex-col">
                <div className="flex flex-col justify-start items-start">
                    <div>
                        <p className="leading-4 text-gray-600 dark:text-white text-3xl">Wishlist</p>
                    </div>
                    <div className="mt-3">
                        <h1 className="text-3xl lg:text-4xl tracking-tight font-semibold leading-8 lg:leading-9 text-gray-600 dark:text-white">Favourites</h1>
                    </div>
                    <div className="mt-4">
                        <p className="text-2xl tracking-tight leading-6 text-gray-600 dark:text-white">{wishlist.length} items</p>
                    </div>
                    <div className="grid md:grid-cols-4 grid-cols-1 gap-3 rounded-lg w-full">
                        {wishlist.map(product => (
                            <div key={product._id} className="flex flex-col shadow-xl p-3 bg-white dark:bg-gray-800">
                                <div className="relative">
                                    <Link to={"/productDetails/" + product._id}>
                                        <img className="rounded-lg w-full" src={product.imageCover} alt={product.title} />
                                    </Link>
                                    <button
                                        aria-label="remove"
                                        className="top-4 right-4 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600 absolute p-1.5 hover:text-gray-400"
                                        onClick={() => removeMutation.mutate(product._id)}
                                        disabled={removeMutation.isPending}
                                    >
                                        <svg className={`fill-current ${removeMutation.isPending ? 'opacity-50' : ''}`} width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M13 1L1 13" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M1 1L13 13" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="mt-2">
                                    <p className="tracking-tight text-xl font-semibold leading-6 text-gray-900 dark:text-white line-clamp-1">{product.title}</p>
                                    <p className="flex justify-start tracking-tight font-bold text-lg leading-8 text-gray-900 dark:text-white mt-1">Price: ${product.price}</p>

                                    <div className="flex flex-col space-y-2 mt-4">
                                        <Link to={"/productDetails/" + product._id} className="w-full">
                                            <button className="rounded-lg p-2 text-green-600 dark:text-white w-full tracking-tight text-lg leading-4 hover:bg-green-100 bg-white border border-green-600 dark:bg-transparent dark:border-white dark:hover:bg-green-600 dark:hover:text-white duration-300">
                                                More information
                                            </button>
                                        </Link>
                                        <button
                                            className="rounded-lg p-3 text-white w-full tracking-tight text-lg leading-4 hover:bg-green-700 bg-green-600 border border-green-600 dark:bg-white dark:text-green-900 dark:hover:bg-green-700 dark:hover:text-white duration-300"
                                            onClick={() => addProductToCart(product._id, userToken)}
                                        >
                                            Add to cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {wishlist.length === 0 && (
                        <div className="w-full flex justify-center items-center py-20">
                            <h2 className="text-2xl text-gray-500">Your wishlist is empty</h2>
                        </div>
                    )}
                </div>
            </div>
            <Helmet>
                <title>Wishlist</title>
            </Helmet>
        </>
    );
}
