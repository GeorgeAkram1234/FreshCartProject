import React, { useEffect, useState } from 'react'
import logo from '../../assets/images/freshcart-logo.svg';
import style from './Home.module.css'
import axios from 'axios'
import Product from '../Product/Product'
import LoadingScreen from '../LoadingScreen/LoadingScreen'
import { Helmet } from 'react-helmet'
import CategoriesSlider from '../categoriesSlider/CategoriesSlider';
import MainSlider from '../MainSlider/MainSlider';

export default function Home() {



  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchInput, setSearchInput] = useState('')

  async function getProducts() {
    setLoading(true)
    try {
      let { data } = await axios.get(`https://ecommerce.routemisr.com/api/v1/products`)
      setProducts(data.data)
      setFilteredProducts(data.data)
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getProducts()
  }, [])

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase()
    setSearchInput(searchTerm)

    const filtered = products.filter(product => {
      const name = product.title?.toLowerCase() || ''
      const description = product.description?.toLowerCase() || ''
      return name.includes(searchTerm) || description.includes(searchTerm)
    })
    setFilteredProducts(filtered)
  }

  return <>
  <div className='overflow-hidden'>
    
  <MainSlider/>
    <CategoriesSlider />
  </div>

    <div className='p-6'>
      <div className="w-3/4 mx-auto my-4">
        <input
          type="text"
          value={searchInput}
          onChange={handleSearch}
          className='w-full p-5 rounded-md outline outline-2 outline-gray-500'
          placeholder='Search for products'
        />
      </div>

      {loading ? (
        <LoadingScreen />
      ) : (
        <div className='container mx-auto grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-3'>
          {filteredProducts.map((product, index) => (
            <Product key={product.id || index} product={product} />
          ))}
        </div>
      )}
    </div>


    <Helmet>
      <title>Home</title>
      <link rel="icon" href={logo} />
    </Helmet>
  </>
}