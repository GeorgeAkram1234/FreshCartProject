import { useContext } from 'react';
import { addProductToCart } from '../../cartService';
import { Link } from 'react-router-dom';
import LoadingScreen from '../LoadingScreen/LoadingScreen'
import { AuthContext } from '../../Contexts/AuthContext';
import { Helmet } from 'react-helmet';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getWishlist, removeProductFromWishlist } from '../../wishlistService';

export default function WishList() {
  const { userToken } = useContext(AuthContext);
  const queryClient = useQueryClient();

  // ⚡ Bolt Optimization: Use React Query to fetch and cache wishlist.
  const { data: wishlist, isLoading } = useQuery({
    queryKey: ['wishlist', userToken],
    queryFn: () => getWishlist(userToken),
    enabled: !!userToken,
  });

  const removeMutation = useMutation({
    mutationFn: (productId) => removeProductFromWishlist(productId, userToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist', userToken] });
    },
  });

  if (isLoading) {
    return <LoadingScreen />;
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
            <p className="text-2xl tracking-tight leading-6 text-gray-600 dark:text-white">{(wishlist || []).length} items</p>
          </div>
          <div className="grid md:grid-cols-4 grid-cols-1 gap-6 mt-8 w-full">
            {(wishlist || []).map(product => (
              <div key={product._id} className="flex flex-col shadow-lg rounded-lg overflow-hidden bg-white dark:bg-gray-800 p-4 transition-transform hover:scale-[1.02]">
                <div className="relative">
                  <Link to={"/productDetails/" + product._id}>
                    <img className="rounded-lg w-full h-48 object-contain" src={product.imageCover} alt={product.title} loading="lazy" />
                  </Link>
                  <button
                    aria-label="remove"
                    className="top-2 right-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 absolute p-2 bg-white/80 dark:bg-gray-700/80 rounded-full hover:text-red-500 transition-colors shadow-sm"
                    onClick={() => removeMutation.mutate(product._id)}
                    disabled={removeMutation.isPending}
                  >
                    <svg className="fill-current" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13 1L1 13" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M1 1L13 13" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>

                <div className="mt-4 flex flex-col flex-grow">
                  <Link to={"/productDetails/" + product._id} className="hover:text-green-600 transition-colors">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white line-clamp-1">{product.title}</h3>
                  </Link>
                  <p className="text-green-600 dark:text-green-400 font-bold text-xl mt-2">${product.price}</p>

                  <div className="flex flex-col gap-2 mt-auto pt-4">
                    <Link to={"/productDetails/" + product._id} className="w-full">
                      <button className="w-full rounded-lg py-2 px-4 text-green-600 border border-green-600 hover:bg-green-50 dark:text-white dark:border-white dark:hover:bg-green-600 transition-colors text-sm font-medium">
                        More information
                      </button>
                    </Link>
                    <button
                      className="w-full rounded-lg py-2 px-4 bg-green-600 text-white hover:bg-green-700 transition-colors text-sm font-medium"
                      onClick={() => addProductToCart(product._id, userToken)}
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {(wishlist || []).length === 0 && (
            <div className="w-full py-20 text-center">
              <p className="text-gray-500 text-xl italic">Your wishlist is empty.</p>
              <Link to="/" className="text-green-600 hover:underline mt-4 inline-block">Continue Shopping</Link>
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
