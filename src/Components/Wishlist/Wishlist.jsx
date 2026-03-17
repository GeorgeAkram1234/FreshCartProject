import { useContext } from 'react';
import { addProductToCart } from '../../cartService';
import { Link } from 'react-router-dom';
import LoadingScreen from '../LoadingScreen/LoadingScreen'
import { AuthContext } from '../../Contexts/AuthContext';
import { WishlistContext } from '../../Contexts/WishlistContext';
import { Helmet } from 'react-helmet';

export default function WishList() {
  const { userToken } = useContext(AuthContext);
  const { wishlist, removeFromWishlist, isLoading } = useContext(WishlistContext);

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
          <div className="grid md:grid-cols-4 grid-cols-1 gap-3 rounded-lg ">
            {wishlist.map(product => (
              <div key={product._id} className="flex flex-col shadow-xl p-3 bg-white dark:bg-gray-800 rounded-lg">
                <div className="relative">
                  <Link to={"/productDetails/" + product._id}>
                    <img className="rounded-lg w-full h-[250px] object-contain" src={product.imageCover} alt={product.title} />
                  </Link>
                  <button
                    aria-label="remove"
                    className="top-4 right-4 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600 absolute p-1.5 text-gray-600 dark:text-white hover:text-red-500 transition-colors"
                    onClick={() => removeFromWishlist(product._id)}
                  >
                    <svg className="fill-current" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13 1L1 13" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M1 1L13 13" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
                <div className="mt-1 flex justify-between items-center ">
                  <div className="flex justify-center items-center">
                    <p className="tracking-tight text-xl font-semibold leading-6 text-gray-600 dark:text-white line-clamp-1">{product.title}</p>
                  </div>
                </div>
                <div className="flex flex-col justify-start items-start mt-2">
                  <div className="mt-1">
                    <p className="tracking-tight text-base font-medium leading-4 text-gray-600 dark:text-white">${product.price}</p>
                  </div>
                  <div className="flex flex-col w-full mt-4 space-y-2">
                    <Link to={"/productDetails/" + product._id} className="w-full">
                      <button className="rounded-lg p-2 text-green-600 border border-green-600 hover:bg-green-600 hover:text-white transition-colors w-full">
                        More information
                      </button>
                    </Link>
                    <button
                      className="rounded-lg p-2 bg-green-600 text-white hover:bg-green-700 transition-colors w-full"
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
      </div>}
      <Helmet>
        <title>Wishlist</title>
      </Helmet>
    </>);
}
