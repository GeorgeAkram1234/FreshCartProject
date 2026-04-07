import Navbar from '../Navbar/Navbar.jsx'
import Footer from '../Footer/Footer.jsx'
import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="min-h-screen bg-white dark:bg-dark-primary text-gray-900 dark:text-dark-text transition-colors duration-200">
      <Navbar />
      <div className="md:pt-12">
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}
