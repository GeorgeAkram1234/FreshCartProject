import React, { Suspense } from 'react'
import style from './Layout.module.css'
import Navbar from '../Navbar/Navbar.jsx'
import Footer from '../Footer/Footer.jsx'
import { Outlet } from 'react-router-dom'
import ThemeToggle from '../ThemeToggle/ThemeToggle'
import LoadingScreen from '../LoadingScreen/LoadingScreen'

export default function Layout() {
  return (
    <div className="min-h-screen bg-white dark:bg-dark-primary text-gray-900 dark:text-dark-text transition-colors duration-200">
      <Navbar />
      <div className="md:pt-12">
        {/* BOLT OPTIMIZATION: Suspense boundary to handle loading states for lazy-loaded route components. */}
        <Suspense fallback={<LoadingScreen />}>
          <Outlet />
        </Suspense>
      </div>
      <Footer />
    </div>
  )
}
