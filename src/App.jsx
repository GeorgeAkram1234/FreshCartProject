import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import Layout from './Components/Layout/Layout.jsx'
import Home from './Components/Home/Home.jsx'
import Cart from './Components/Cart/Cart.jsx'
import Product from './Components/Product/Product.jsx'
import Categories from './Components/Categories/Categories.jsx'
import Brands from './Components/Brands/Brands.jsx'
import Login from './Components/Login/Login.jsx'
import Register from './Components/Register/Register.jsx'
import Notfound from './Components/Notfound/Notfound.jsx'
import CounterContextProvider from './Contexts/CounterContext.jsx'
import AuthContextProvider from './Contexts/AuthContext.jsx'
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute.jsx'
import ProtectAuthRoutes from './Components/ProtectAuthRoutes/ProtectAuthRoutes.jsx'
import ProductDetails from './Components/ProductDetails/ProductDetails.jsx'
import Products from './Components/Products/Products.jsx'
import { ToastContainer } from 'react-toastify'
import ShippingAddress from './Components/ShippingAddress/ShippingAddress.jsx'
import Orders from './Components/AllOrders/Orders.jsx'
import { Offline } from 'react-detect-offline'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import Wishlist from './Components/Wishlist/Wishlist.jsx'
import ForgetPass from './Components/ForgetPass/ForgetPass.jsx'
import VerifyCode from './Components/VerifyCode/VerifyCode.jsx'


let routers = createBrowserRouter([
  {
    path: '', element: <Layout />, children: [
      // {path:'' , element:<Navigate to={'home'}/>},
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
  // {path:'*' , element:<Notfound/>}


])

function App() {

  const queryClient = new QueryClient()



  return (
    <>
    <QueryClientProvider client={queryClient}>
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
      <ReactQueryDevtools 
      />
    </QueryClientProvider>
    </>
  )
}

export default App
