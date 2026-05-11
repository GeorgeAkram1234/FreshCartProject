import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useState } from 'react'
import { Helmet } from 'react-helmet'
import Product from '../Product/Product'
import LoadingScreen from '../LoadingScreen/LoadingScreen'

export default function Products() {
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
                    isLoading ? <LoadingScreen /> :
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
