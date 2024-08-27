import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import Product from '../Product/Product'
import LoadingScreen from '../LoadingScreen/LoadingScreen'

export default function Products() {
    const [searchInput, setSearchInput] = useState('')
    const [products, setProducts] = useState([])
    const [filteredProducts, setFilteredProducts] = useState([])
    const [loading, setLoading] = useState(true)

    async function getProducts() {
        setLoading(true)
        try {
            let { data } = await axios.get(`https://ecommerce.routemisr.com/api/v1/products`)
            setProducts(data.data)
            console.log(data.data);
            
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

    return (
        <>
            <div className="w-3/4 mx-auto my-4 ">
                <input 
                    type="text" 
                    value={searchInput}
                    onChange={handleSearch}
                    className='w-full p-5 rounded-md outline outline-2 outline-gray-500 ' 
                    placeholder='search for products' 
                />
            </div>
            <div className="w-11/12 mx-auto">
                {
                    loading ? <LoadingScreen /> : 
                    <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-3'>
                        {filteredProducts.map((product, index) => {
                            return <Product product={product} key={product.id || index} />
                        })}
                    </div>
                }
            </div>
            <Helmet>
                <title>Products</title>
            </Helmet>
        </>
    )
}