import { useContext } from 'react';
import { toast, Bounce } from 'react-toastify';
import { addProductToCart } from '../../cartService';
import { removeProductFromWishlist, getWishlist } from '../../wishlistService';
import { Link } from 'react-router-dom';
import LoadingScreen from '../LoadingScreen/LoadingScreen'
import { AuthContext } from '../../Contexts/AuthContext';
import { Helmet } from 'react-helmet';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export default function WishList() {
  const { userToken } = useContext(AuthContext);
  const queryClient = useQueryClient();

  // BOLT OPTIMIZATION: Use the same React Query key as the Product component
  // to leverage the cache and ensure data consistency.
  const { data: wishlist, isLoading, error } = useQuery({
    queryKey: ['wishlist', userToken],
    queryFn: () => getWishlist(userToken),
    enabled: !!userToken,
    staleTime: 600000, // 10 minutes
  });

  async function productRemove(productId) {
    try {
      await removeProductFromWishlist(productId, userToken);
      // Invalidate the wishlist query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['wishlist', userToken] });
    } catch (error) {
      console.error("Error removing product:", error);
    }
  }

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    toast.error("Failed to fetch wishlist", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
    return <div className="text-center py-20 text-2xl text-red-600">Error loading wishlist. Please try again.</div>;
  }

  const wishlistItems = wishlist || [];

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
            <p className="text-2xl tracking-tight leading-6 text-gray-600 dark:text-white">{wishlistItems.length} items</p>
          </div>
          <div className="grid md:grid-cols-4 grid-cols-1 gap-6 w-full mt-8">
            {wishlistItems.map(product => (
              <div key={product.id || product._id} className="flex flex-col shadow-xl p-3 bg-white dark:bg-gray-800 rounded-lg">
                <div className="relative">
                  <Link to={"/productDetails/" + product._id}>
                    <img className="rounded-lg w-full h-64 object-contain" src={product.imageCover} alt={product.title} />
                  </Link>
                  <button
                    aria-label="remove"
                    className="top-2 right-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600 absolute p-2 bg-white/80 rounded-full hover:text-red-600 transition-colors"
                    onClick={() => productRemove(product.id || product._id)}
                  >
                    <svg className="fill-current" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13 1L1 13" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M1 1L13 13" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
                <div className="mt-4 flex flex-col flex-grow">
                  <h2 className="text-xl font-semibold leading-6 text-gray-800 dark:text-white line-clamp-1">{product.title}</h2>
                  <p className="mt-2 text-lg font-bold text-gray-900 dark:text-white">Price: ${product.price}</p>

                  <div className="flex flex-col gap-2 mt-auto pt-4">
                    <Link to={"/productDetails/" + product._id} className="w-full">
                      <button className="rounded-lg p-3 focus:outline-none focus:ring-gray-600 focus:ring-offset-2 focus:ring-2 text-green-600 dark:text-white w-full tracking-tight py-2 text-lg leading-4 hover:bg-green-300 hover:text-green-600 bg-white border border-green-600 dark:bg-transparent dark:border-white dark:hover:bg-green-600 dark:hover:text-white transition-colors">
                        More information
                      </button>
                    </Link>
                    <button
                      className="rounded-lg p-3 focus:outline-none focus:ring-green-600 focus:ring-offset-2 focus:ring-2 text-white w-full tracking-tight py-2 text-lg leading-4 hover:bg-green-700 bg-green-600 border border-green-600 transition-colors"
                      onClick={() => addProductToCart(product._id || product.id, userToken)}
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {wishlistItems.length === 0 && (
            <div className="w-full text-center py-20">
              <p className="text-2xl text-gray-500">Your wishlist is empty.</p>
              <Link to="/" className="text-green-600 hover:underline mt-4 inline-block text-xl">Start shopping</Link>
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
