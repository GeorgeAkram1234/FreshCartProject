import React, { useContext, useState } from 'react';
import style from './Navbar.module.css'; // Make sure to define your styles in Navbar.module.css
import logo from '../../assets/images/freshcart-logo.svg';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Contexts/AuthContext';

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
    <>
      <nav className='bg-gray-200 md:fixed top-0 inset-x-0 py-3 capitalize z-50'>
        <div className="container flex flex-col md:flex-row justify-between text-gray-500">
          <div className='flex flex-col md:flex-row space-x-3'>
            <div className="flex justify-between w-4/5 mx-auto ">
              <img src={logo} width={120} alt="" />
              <div className='inline md:hidden' onClick={toggleMenu}>
                <i className="fas fa-bars cursor-pointer"></i>
              </div>
            </div>
            {userToken && <ul className={`md:flex flex-col md:flex-row md:space-x-2 px-8 ${menuOpen ? '' : 'hidden'}`}>
              <li><NavLink to="/">Home</NavLink></li>
              <li><NavLink to="/cart">Cart</NavLink></li>
              <li><NavLink to="/products">Products</NavLink></li>
              <li><NavLink to="/categories">Categories</NavLink></li>
              <li><NavLink to="/brands">Brands</NavLink></li>
              <li><NavLink to="/wishlist">Wishlist</NavLink></li>
            </ul>}
          </div>
          <div>
            <ul className={`md:flex flex-col md:flex-row space-x-2 px-8 ${menuOpen ? '' : 'hidden'}`}>
              <li className='space-x-2 text-black'>
                <NavLink to="/cart" className='text-black'><i className="text-2xl fa-solid fa-cart-shopping"></i></NavLink>
                <i className='fab fa-facebook-f'></i>
                <i className='fab fa-linkedin-in'></i>
                <i className='fab fa-youtube'></i>
                <i className='fab fa-twitter'></i>
                <i className='fab fa-instagram'></i>
              </li>
              {!userToken ?<>
                <li><NavLink to="/login">Login</NavLink></li>
                <li><NavLink to="/register">Register</NavLink></li>
              </> : 
              <button onClick={()=>logout()}><span>Logout</span></button>
              }
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
