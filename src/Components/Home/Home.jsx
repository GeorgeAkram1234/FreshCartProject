import { useState } from 'react'
import logo from '../../assets/images/freshcart-logo.svg';
import axios from 'axios'
import Product from '../Product/Product'
import LoadingScreen from '../LoadingScreen/LoadingScreen'
import { Helmet } from 'react-helmet'
import CategoriesSlider from '../categoriesSlider/CategoriesSlider';
import MainSlider from '../MainSlider/MainSlider';
import { useQuery } from '@tanstack/react-query';

export default function Home() {
  const [searchInput, setSearchInput] = useState('')

  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data } = await axios.get(`https://ecommerce.routemisr.com/api/v1/products`)
      return data.data
    },
    staleTime: 600000, // Cache for 10 minutes
  })

  const handleSearch = (e) => {
    setSearchInput(e.target.value.toLowerCase())
  }

  const filteredProducts = products?.filter(product => {
    const searchTerm = searchInput.toLowerCase()
    const name = product.title?.toLowerCase() || ''
    const description = product.description?.toLowerCase() || ''
    return name.includes(searchTerm) || description.includes(searchTerm)
  }) || []

  return <>
    <div className='overflow-hidden'>
      <MainSlider />
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

      {isLoading ? (
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
