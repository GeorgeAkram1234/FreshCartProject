import { useContext } from 'react';
import 'react-toastify/dist/ReactToastify.css'; // Ensure you have this import for toastify styles
import { addProductToCart } from '../../cartService';
import { Link } from 'react-router-dom';
import LoadingScreen from '../LoadingScreen/LoadingScreen'
import { AuthContext } from '../../Contexts/AuthContext';
import { Helmet } from 'react-helmet';
import { WishlistContext } from '../../Contexts/WishlistContext';

export default function WishList() {


  let { userToken } = useContext(AuthContext)
  const { wishlistData: wishlist, isLoading, removeFromWishlist } = useContext(WishlistContext);


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
              <div key={product._id} className="flex flex-col shadow-xl p-3">
                <div className="relative">
                  <Link to={"/productDetails/" + product._id}>
                    <img className=" rounded-lg lg:block" src={product.imageCover} alt={product.name} />
                  </Link>
                  <button
                    aria-label="remove"
                    className="top-4 right-4 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600 absolute p-1.5 hover:text-gray-400"
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
                    <p className="tracking-tight text-2xl font-semibold leading-6 text-gray-600 dark:text-white">{product.name}</p>
                  </div>

                </div>
                <div className="flex flex-col justify-start items-start mt-0">
                  <div>
                    <p className=" tracking-tight text-xs leading-3 text-gray-600 dark:text-white">{product.code}</p>
                  </div>
                  <div className="mt-1">
                    <p className="tracking-tight text-base font-medium leading-4 text-gray-600 dark:text-white">{product.color}</p>
                  </div>
                  <div className="mt-1">
                    <p className="tracking-tight text-base font-medium leading-4 text-gray-600 dark:text-white">{product.name}</p>
                  </div>
                  <div className="mt-1">
                    <p className="  flex justify-start  tracking-tight font-bold  text-lg leading-4 text-gray-600 dark:text-white"> Price : ${product.price}</p>
                  </div>
                  <div className="flex justify-between flex-col lg:flex-row items-center mt-4  space-y-1 lg:space-y-0 lg:space-x-1 xl:space-x-8">
                    <div className="w-full">
                      <Link to={"/productDetails/" + product._id}>
                      <button className=" rounded-lg p-3 focus:outline-none focus:ring-gray-600 focus:ring-offset-2 focus:ring-2 text-green-600 dark:text-white w-full tracking-tight py-2 text-lg leading-4 hover:bg-green-300 hover:text-green-600 bg-white border border-green-600 dark:bg-transparent dark:border-white dark:hover:bg-green-600 dark:hover:text-white"
                        >More information</button>
                      </Link>
                    </div>
                    <div className="w-full">
                    <button className=" rounded-lg p-3focus:outline-none focus:ring-green-600 focus:ring-offset-2 focus:ring-2 text-white w-full tracking-tight py-4 text-lg leading-4 hover:bg-green-700 bg-green-600 border border-green-600 dark:bg-white dark:text-green-900 dark:hover:bg-green-700 dark:hover:text-white"
                        onClick={() => addProductToCart(product._id, userToken)}
                      >Add to cart</button>
                    </div>
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