import { Suspense } from 'react'
import Navbar from '../Navbar/Navbar.jsx'
import Footer from '../Footer/Footer.jsx'
import { Outlet } from 'react-router-dom'
import LoadingScreen from '../LoadingScreen/LoadingScreen'

/**
 * BOLT OPTIMIZATION: Route-based code splitting.
 * Using Suspense here to handle the loading state of lazy-loaded route components.
 * This keeps the UI responsive by showing a LoadingScreen while chunks are being fetched.
 */

export default function Layout() {
  return (
    <div className="min-h-screen bg-white dark:bg-dark-primary text-gray-900 dark:text-dark-text transition-colors duration-200">
      <Navbar />
      <div className="md:pt-12">
        <Suspense fallback={<LoadingScreen />}>
          <Outlet />
        </Suspense>
      </div>
      <Footer />
    </div>
  )
}
