import { useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getWishlist, removeProductFromWishlist } from '../../wishlistService';
import { addProductToCart } from '../../cartService';
import { Link } from 'react-router-dom';
import LoadingScreen from '../LoadingScreen/LoadingScreen';
import { AuthContext } from '../../Contexts/AuthContext';
import { Helmet } from 'react-helmet';

export default function WishList() {
  const { userToken } = useContext(AuthContext);
  const queryClient = useQueryClient();

  // Fetch wishlist using React Query
  const { data: wishlistData, isLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: () => getWishlist(userToken),
    enabled: !!userToken,
    staleTime: 600000,
  });

  const wishlist = wishlistData?.data || [];

  // Mutation for removing from wishlist
  const removeMutation = useMutation({
    mutationFn: (productId) => removeProductFromWishlist(productId, userToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
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
              <div key={product._id} className="flex flex-col shadow-xl p-3 bg-white dark:bg-gray-800 rounded-lg">
                <div className="relative">
                  <Link to={"/productDetails/" + product._id}>
                    <img className="rounded-lg w-full" src={product.imageCover} alt={product.title || product.name} loading="lazy" />
                  </Link>
                  <button
                    aria-label="remove"
                    disabled={removeMutation.isPending}
                    className="top-4 right-4 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600 absolute p-1.5 hover:text-red-500 transition-colors"
                    onClick={() => removeMutation.mutate(product._id)}
                  >
                    <svg className="fill-current" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13 1L1 13" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M1 1L13 13" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
                <div className="mt-2 flex flex-col h-full justify-between">
                  <div>
                    <h3 className="text-xl font-semibold leading-6 text-gray-800 dark:text-white truncate" title={product.title || product.name}>
                      {product.title || product.name}
                    </h3>
                    {/* Preserving fields that might be used for specific UI info if available */}
                    {product.code && <p className="text-xs text-gray-500">{product.code}</p>}
                    {product.color && <p className="text-sm text-gray-600">{product.color}</p>}
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{product.category?.name}</p>
                    <p className="mt-2 text-lg font-bold text-gray-900 dark:text-white">Price: ${product.price}</p>
                  </div>
                  <div className="flex flex-col gap-2 mt-4">
                    <Link to={"/productDetails/" + product._id} className="w-full">
                      <button className="rounded-lg p-2 text-green-600 dark:text-white w-full tracking-tight text-base leading-4 hover:bg-green-100 border border-green-600 transition-colors">
                        More information
                      </button>
                    </Link>
                    <button
                      className="rounded-lg p-2 text-white w-full tracking-tight text-base leading-4 hover:bg-green-700 bg-green-600 border border-green-600 transition-colors"
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
            <div className="w-full py-20 text-center">
              <p className="text-2xl text-gray-500">Your wishlist is empty</p>
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
