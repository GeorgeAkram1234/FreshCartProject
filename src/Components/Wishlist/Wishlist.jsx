import { useContext } from 'react';
import { addProductToCart } from '../../cartService';
import { Link } from 'react-router-dom';
import LoadingScreen from '../LoadingScreen/LoadingScreen'
import { AuthContext } from '../../Contexts/AuthContext';
import { Helmet } from 'react-helmet';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getWishlist, removeProductFromWishlist } from '../../wishlistService';

export default function WishList() {
  const { userToken } = useContext(AuthContext)
  const queryClient = useQueryClient();

  // Use React Query for fetching wishlist
  const { data: wishlist = [], isLoading } = useQuery({
    queryKey: ['wishlist', userToken],
    queryFn: () => getWishlist(userToken),
    enabled: !!userToken,
  });

  // Mutation for removing from wishlist
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
            <p className="text-2xl tracking-tight leading-6 text-gray-600 dark:text-white">{wishlist.length} items</p>
          </div>
          <div className="grid md:grid-cols-4 grid-cols-1 gap-3 rounded-lg w-full">
            {wishlist.map(product => (
              <div key={product._id || product.id} className="flex flex-col shadow-xl p-3 bg-white dark:bg-gray-800 rounded-lg transition-all duration-300 hover:shadow-2xl">
                <div className="relative">
                  <Link to={"/productDetails/" + product._id}>
                    {/* Optimization: added loading="lazy" */}
                    <img className="rounded-lg w-full h-auto object-cover" src={product.imageCover} alt={product.title} loading="lazy" />
                  </Link>
                  <button
                    aria-label="remove"
                    className="top-4 right-4 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600 absolute p-1.5 hover:text-red-500 transition-colors bg-white/80 rounded-full"
                    onClick={() => removeMutation.mutate(product._id || product.id)}
                    disabled={removeMutation.isPending}
                  >
                    <svg className="fill-current" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13 1L1 13" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M1 1L13 13" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
                <div className="mt-4 flex flex-col flex-grow">
                  <Link to={"/productDetails/" + product._id}>
                    <h3 className="tracking-tight text-xl font-semibold leading-6 text-gray-800 dark:text-white line-clamp-1">{product.title}</h3>
                  </Link>
                  <div className="mt-2 flex-grow">
                    <p className="flex justify-start tracking-tight font-bold text-2xl text-blue-600 dark:text-blue-400"> ${product.price}</p>
                  </div>
                  <div className="flex flex-col space-y-2 mt-4">
                    <Link to={"/productDetails/" + product._id} className="w-full">
                      <button className="rounded-lg p-3 w-full text-green-600 dark:text-white tracking-tight py-2 text-lg leading-4 hover:bg-green-50 bg-white border border-green-600 dark:bg-transparent dark:border-white dark:hover:bg-green-600 transition-colors">
                        View Details
                      </button>
                    </Link>
                    <button
                      className="rounded-lg p-3 w-full text-white bg-green-600 border border-green-600 py-2 text-lg leading-4 hover:bg-green-700 transition-colors"
                      onClick={() => addProductToCart(product._id, userToken)}
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Helmet>
        <title>Wishlist</title>
      </Helmet>
    </>
  );
}
