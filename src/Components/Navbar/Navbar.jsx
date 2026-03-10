import { useContext, useState } from 'react';
import style from './Navbar.module.css'; // Make sure to define your styles in Navbar.module.css
import logo from '../../assets/images/freshcart-logo.svg';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Contexts/AuthContext';
import ThemeToggle from '../ThemeToggle/ThemeToggle';

export default function Navbar() {

  let { userToken ,setUserToken } = useContext(AuthContext)
  // console.log(userToken);

  const navigate = useNavigate()
  function logout(){
    setUserToken('')
    localStorage.removeItem('token')
    navigate('/login')
  }

  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className='bg-gray-200 dark:bg-dark-secondary md:fixed top-0 inset-x-0 py-3 capitalize z-50 transition-colors duration-200'>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo and Mobile Menu Button */}
          <div className="flex justify-between items-center w-full md:w-auto">
            <img src={logo} width={120} alt="FreshCart" className="cursor-pointer" onClick={() => navigate('/')} />
            <button 
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle menu"
            >
              <i className={`fas ${menuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
            </button>
          </div>

          {/* Navigation Links */}
          {userToken && (
            <div className={`${menuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 mt-4 md:mt-0`}>
              <NavLink 
                to="/" 
                className={({ isActive }) => 
                  `px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-300 dark:hover:bg-gray-700 ${
                    isActive ? 'bg-gray-300 dark:bg-gray-700' : ''
                  }`
                }
              >
                Home
              </NavLink>
              <NavLink 
                to="/cart" 
                className={({ isActive }) => 
                  `px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-300 dark:hover:bg-gray-700 ${
                    isActive ? 'bg-gray-300 dark:bg-gray-700' : ''
                  }`
                }
              >
                Cart
              </NavLink>
              <NavLink 
                to="/products" 
                className={({ isActive }) => 
                  `px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-300 dark:hover:bg-gray-700 ${
                    isActive ? 'bg-gray-300 dark:bg-gray-700' : ''
                  }`
                }
              >
                Products
              </NavLink>
              <NavLink 
                to="/categories" 
                className={({ isActive }) => 
                  `px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-300 dark:hover:bg-gray-700 ${
                    isActive ? 'bg-gray-300 dark:bg-gray-700' : ''
                  }`
                }
              >
                Categories
              </NavLink>
              <NavLink 
                to="/brands" 
                className={({ isActive }) => 
                  `px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-300 dark:hover:bg-gray-700 ${
                    isActive ? 'bg-gray-300 dark:bg-gray-700' : ''
                  }`
                }
              >
                Brands
              </NavLink>
              <NavLink 
                to="/wishlist" 
                className={({ isActive }) => 
                  `px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-300 dark:hover:bg-gray-700 ${
                    isActive ? 'bg-gray-300 dark:bg-gray-700' : ''
                  }`
                }
              >
                Wishlist
              </NavLink>
            </div>
          )}

          {/* Right Side Menu */}
          <div className={`${menuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 mt-4 md:mt-0`}>
            {/* Social Icons */}
            <div className="flex items-center space-x-4">
              <NavLink to="/cart" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                <i className="text-2xl fa-solid fa-cart-shopping"></i>
              </NavLink>
              <div className="flex space-x-3">
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                  <i className="fab fa-linkedin-in"></i>
                </a>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                  <i className="fab fa-youtube"></i>
                </a>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>

            {/* Theme Toggle */}
            <div className="flex items-center">
              <ThemeToggle />
            </div>

            {/* Auth Buttons */}
            {!userToken ? (
              <div className="flex items-center space-x-4">
                <NavLink 
                  to="/login" 
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                >
                  Login
                </NavLink>
                <NavLink 
                  to="/register" 
                  className="px-4 py-2 rounded-lg border border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/50 transition-colors"
                >
                  Register
                </NavLink>
              </div>
            ) : (
              <button 
                onClick={logout}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
