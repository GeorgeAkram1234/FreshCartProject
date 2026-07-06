import { useContext } from 'react';
import axios from 'axios';
import { toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addProductToCart } from '../../cartService';
import { getWishlist } from '../../wishlistService';
import { Link } from 'react-router-dom';
import LoadingScreen from '../LoadingScreen/LoadingScreen'
import { AuthContext } from '../../Contexts/AuthContext';
import { Helmet } from 'react-helmet';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export default function WishList() {
  const { userToken } = useContext(AuthContext);
  const queryClient = useQueryClient();

  // BOLT OPTIMIZATION: Reuse the same React Query cache as the Product components.
  // This ensures data consistency across the app and avoids redundant network requests.
  const { data: wishlistData, isLoading, isError } = useQuery({
    queryKey: ['wishlist', userToken],
    queryFn: () => getWishlist(userToken),
    enabled: !!userToken,
    staleTime: 10 * 60 * 1000,
  });

  const wishlist = wishlistData?.data || [];

  const removeMutation = useMutation({
    mutationFn: async (productId) => {
      await axios.delete(`https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`, {
        headers: {
          token: userToken,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist', userToken] });
      toast.success("Product removed from wishlist successfully", {
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
    },
    onError: () => {
      toast.error("Failed to remove product from wishlist", {
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
    }
  });

  if (isLoading) return <LoadingScreen />;
  if (isError) return <div className="py-20 text-center text-red-500">Error loading wishlist</div>;

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
              <div key={product.id} className="flex flex-col shadow-xl p-3 bg-white dark:bg-gray-800 rounded-lg">
                <div className="relative">
                  <Link to={"/productDetails/" + product._id}>
                    <img className=" rounded-lg w-full h-64 object-contain" src={product.imageCover} alt={product.name} />
                  </Link>
                  <button
                    aria-label="remove"
                    className="top-4 right-4 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600 absolute p-1.5 hover:text-gray-400 bg-white/80 rounded-full"
                    onClick={() => removeMutation.mutate(product.id)}
                    disabled={removeMutation.isPending}
                  >
                    <svg className="fill-current text-gray-800" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13 1L1 13" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M1 1L13 13" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
                <div className="mt-4">
                  <p className="tracking-tight text-xl font-semibold text-gray-800 dark:text-white line-clamp-1">{product.title}</p>
                  <p className="font-bold text-lg text-green-600 mt-2">${product.price}</p>
                </div>
                <div className="flex flex-col gap-2 mt-4">
                  <Link to={"/productDetails/" + product._id} className="w-full">
                    <button className="rounded-lg p-2 text-green-600 border border-green-600 w-full hover:bg-green-50 transition-colors">
                      More information
                    </button>
                  </Link>
                  <button
                    className="rounded-lg p-2 bg-green-600 text-white w-full hover:bg-green-700 transition-colors"
                    onClick={() => addProductToCart(product._id, userToken)}
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            ))}
          </div>
          {wishlist.length === 0 && (
            <div className="w-full text-center py-10 text-gray-500">Your wishlist is empty.</div>
          )}
        </div>
      </div>
      <Helmet>
        <title>Wishlist</title>
      </Helmet>
    </>
  );
}
