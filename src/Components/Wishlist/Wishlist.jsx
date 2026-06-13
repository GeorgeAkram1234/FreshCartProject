import { useContext } from 'react';
import { addProductToCart } from '../../cartService';
import { Link } from 'react-router-dom';
import LoadingScreen from '../LoadingScreen/LoadingScreen'
import { AuthContext } from '../../Contexts/AuthContext';
import { Helmet } from 'react-helmet';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getWishlist, removeProductFromWishlist } from '../../wishlistService';

export default function WishList() {
  const { userToken } = useContext(AuthContext);
  const queryClient = useQueryClient();

  // BOLT OPTIMIZATION: Sync with the shared React Query wishlist cache.
  // This avoids redundant fetching and provides instant loading if data is already cached.
  const { data: wishlist = [], isLoading } = useQuery({
    queryKey: ['wishlist', userToken],
    queryFn: () => getWishlist(userToken),
    enabled: !!userToken,
    staleTime: 600000,
  });

  async function productRemove(productId) {
    try {
      await removeProductFromWishlist(productId, userToken);
      // Invalidate the cache to trigger a refetch and update all components
      queryClient.invalidateQueries({ queryKey: ['wishlist', userToken] });
    } catch (error) {
      console.error("Failed to remove product:", error);
    }
  }

  return (
    <>
      {isLoading ? <LoadingScreen /> : <div className="mx-auto container px-4 md:px-6 2xl:px-0 py-12 flex flex-col">
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
          <div className="grid md:grid-cols-4 grid-cols-1 gap-6 mt-8">
            {wishlist.map(product => (
              <div key={product.id || product._id} className="flex flex-col shadow-xl p-4 bg-white dark:bg-gray-800 rounded-lg">
                <div className="relative group">
                  <Link to={"/productDetails/" + (product._id || product.id)}>
                    <img className="rounded-lg w-full h-64 object-contain" src={product.imageCover} alt={product.title} />
                  </Link>
                  <button
                    aria-label="remove"
                    className="top-2 right-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 absolute p-2 bg-white/80 dark:bg-gray-700/80 rounded-full hover:text-red-500 transition-colors"
                    onClick={() => productRemove(product.id || product._id)}
                  >
                    <svg className="fill-current" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13 1L1 13" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M1 1L13 13" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>

                <div className="mt-4 flex flex-col flex-grow">
                  <h3 className="tracking-tight text-xl font-semibold leading-6 text-gray-900 dark:text-white line-clamp-1">{product.title}</h3>
                  <div className="mt-2 flex-grow">
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">{product.description}</p>
                  </div>
                  <p className="mt-2 font-bold text-lg text-gray-900 dark:text-white"> Price: ${product.price}</p>

                  <div className="flex flex-col gap-2 mt-4">
                    <Link to={"/productDetails/" + (product._id || product.id)} className="w-full">
                      <button className="w-full rounded-lg p-2 text-green-600 border border-green-600 hover:bg-green-50 dark:text-green-400 dark:border-green-400 transition-colors">
                        More information
                      </button>
                    </Link>
                    <button
                      className="w-full rounded-lg p-2 bg-green-600 text-white hover:bg-green-700 transition-colors"
                      onClick={() => addProductToCart(product._id || product.id, userToken)}
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {wishlist.length === 0 && (
            <div className="w-full text-center py-20">
              <p className="text-gray-500 text-xl">Your wishlist is currently empty.</p>
            </div>
          )}
        </div>
      </div>}
      <Helmet>
        <title>Wishlist</title>
      </Helmet>
    </>
  );
}
