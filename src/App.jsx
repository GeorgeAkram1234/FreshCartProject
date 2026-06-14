import { lazy } from 'react'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './Components/Layout/Layout.jsx'
import CounterContextProvider from './Contexts/CounterContext.jsx'
import AuthContextProvider from './Contexts/AuthContext.jsx'
import { ThemeProvider } from './Contexts/ThemeContext.jsx'
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute.jsx'
import ProtectAuthRoutes from './Components/ProtectAuthRoutes/ProtectAuthRoutes.jsx'
import { ToastContainer } from 'react-toastify'
import { Offline } from 'react-detect-offline'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

// BOLT OPTIMIZATION: Route-based code splitting to reduce initial bundle size
const Home = lazy(() => import('./Components/Home/Home.jsx'))
const Cart = lazy(() => import('./Components/Cart/Cart.jsx'))
const Wishlist = lazy(() => import('./Components/Wishlist/Wishlist.jsx'))
const Products = lazy(() => import('./Components/Products/Products.jsx'))
const Categories = lazy(() => import('./Components/Categories/Categories.jsx'))
const Brands = lazy(() => import('./Components/Brands/Brands.jsx'))
const ForgetPass = lazy(() => import('./Components/ForgetPass/ForgetPass.jsx'))
const VerifyCode = lazy(() => import('./Components/VerifyCode/VerifyCode.jsx'))
const ShippingAddress = lazy(() => import('./Components/ShippingAddress/ShippingAddress.jsx'))
const Orders = lazy(() => import('./Components/AllOrders/Orders.jsx'))
const ProductDetails = lazy(() => import('./Components/ProductDetails/ProductDetails.jsx'))
const Login = lazy(() => import('./Components/Login/Login.jsx'))
const Register = lazy(() => import('./Components/Register/Register.jsx'))
const Notfound = lazy(() => import('./Components/Notfound/Notfound.jsx'))

const routers = createBrowserRouter([
  {
    path: '', element: <Layout />, children: [
      { index: true, element: <ProtectedRoute><Home/></ProtectedRoute> },
      { path: 'cart', element: <ProtectedRoute><Cart /></ProtectedRoute> },
      { path: 'wishlist', element: <ProtectedRoute><Wishlist /></ProtectedRoute> },
      { path: 'products', element: <ProtectedRoute><Products /></ProtectedRoute> },
      { path: 'categories', element: <ProtectedRoute><Categories /></ProtectedRoute>},
      { path: 'brands', element: <ProtectedRoute><Brands /> </ProtectedRoute>},
      { path: 'forgetPass', element: <ProtectAuthRoutes><ForgetPass /> </ProtectAuthRoutes>},
      { path: 'verifyCode', element: <ProtectAuthRoutes><VerifyCode/> </ProtectAuthRoutes>},
      { path: 'shippingAddress/:cartId', element: <ProtectedRoute><ShippingAddress /> </ProtectedRoute>},
      { path: 'allorders', element: <ProtectedRoute><Orders /> </ProtectedRoute>},
      { path: 'productdetails/:id', element: <ProtectedRoute><ProductDetails /> </ProtectedRoute>},
      { path: 'login', element:<ProtectAuthRoutes><Login /> </ProtectAuthRoutes> },
      { path: 'register', element:<ProtectAuthRoutes><Register /> </ProtectAuthRoutes> },
      { path: '*', element: <Notfound /> },
    ]
  },
])

const queryClient = new QueryClient()

function App() {
  return (
    <>
    <QueryClientProvider client={queryClient}>
    <ThemeProvider>
        <AuthContextProvider>
            <CounterContextProvider>
              <RouterProvider router={routers}></RouterProvider>
              <ToastContainer/>
              <Offline>
                <div className='fixed bottom-4 start-4 rounded-md bg-yellow-200 p-4'>
                  You are offline
                </div>
              </Offline>
            </CounterContextProvider>
          </AuthContextProvider>
        </ThemeProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
    </>
  )
}

export default App
