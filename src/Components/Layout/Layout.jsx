import { Suspense } from 'react'
import Navbar from '../Navbar/Navbar.jsx'
import Footer from '../Footer/Footer.jsx'
import { Outlet } from 'react-router-dom'
import LoadingScreen from '../LoadingScreen/LoadingScreen.jsx'

export default function Layout() {
  return (
    <div className="min-h-screen bg-white dark:bg-dark-primary text-gray-900 dark:text-dark-text transition-colors duration-200">
      <Navbar />
      <div className="md:pt-12">
        {/* Suspense boundary handles the loading state of lazy-loaded routes */}
        {/* Placed here so Navbar and Footer remain visible during route transitions */}
        <Suspense fallback={<LoadingScreen />}>
          <Outlet />
        </Suspense>
      </div>
      <Footer />
    </div>
  )
}
