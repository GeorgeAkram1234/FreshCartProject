import { useContext } from 'react';
import { addProductToCart } from '../../cartService';
import { Link } from 'react-router-dom';
import LoadingScreen from '../LoadingScreen/LoadingScreen'
import { AuthContext } from '../../Contexts/AuthContext';
import { Helmet } from 'react-helmet';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getWishlist, removeProductFromWishlist } from '../../wishlistService';

export default function WishList() {
  const { userToken } = useContext(AuthContext);
  const queryClient = useQueryClient();

  // Use React Query to manage wishlist data
  const { data: wishlist, isLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: () => getWishlist(userToken),
    enabled: !!userToken,
    select: (data) => data.data || [],
  });

  // Mutation for removing products from wishlist
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
            <p className="text-2xl tracking-tight leading-6 text-gray-600 dark:text-white">{(wishlist || []).length} items</p>
          </div>
          <div className="grid md:grid-cols-4 grid-cols-1 gap-3 rounded-lg w-full mt-8">
            {(wishlist || []).map(product => (
              <div key={product._id} className="flex flex-col shadow-xl p-3 bg-white dark:bg-gray-800 rounded-lg">
                <div className="relative">
                  <Link to={"/productDetails/" + product._id}>
                    <img className="rounded-lg w-full h-64 object-contain" src={product.imageCover} alt={product.title} loading="lazy" />
                  </Link>
                  <button
                    aria-label="remove"
                    className="top-2 right-2 focus:outline-none absolute p-2 bg-white/80 rounded-full hover:text-red-500 transition-colors"
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
                  <Link to={"/productDetails/" + product._id}>
                    <p className="tracking-tight text-xl font-semibold leading-6 text-gray-900 dark:text-white line-clamp-1">{product.title}</p>
                  </Link>
                  <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">Price: ${product.price}</p>

                  <div className="flex flex-col gap-2 mt-auto pt-4">
                    <Link to={"/productDetails/" + product._id} className="w-full">
                      <button className="rounded-lg p-3 text-green-600 dark:text-white w-full tracking-tight py-2 text-lg leading-4 hover:bg-green-50 bg-white border border-green-600 dark:bg-transparent dark:border-white dark:hover:bg-green-600 dark:hover:text-white transition-colors">
                        More information
                      </button>
                    </Link>
                    <button
                      className="rounded-lg p-3 text-white w-full tracking-tight py-2 text-lg leading-4 hover:bg-green-700 bg-green-600 border border-green-600 dark:bg-white dark:text-green-900 dark:hover:bg-green-700 dark:hover:text-white transition-colors"
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
            <div className="w-full text-center py-20">
              <p className="text-2xl text-gray-500">Your wishlist is empty</p>
              <Link to="/products" className="text-green-600 hover:underline mt-4 inline-block text-lg">Start shopping</Link>
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
