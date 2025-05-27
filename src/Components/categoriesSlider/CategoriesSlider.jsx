import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Slider from 'react-slick'
import LoadingScreen from '../LoadingScreen/LoadingScreen'

export default function CategoriesSlider() {
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)

    async function getCategories() {
        try {
            let { data } = await axios.get(`https://ecommerce.routemisr.com/api/v1/categories`)
            setCategories(data.data)
        } catch (error) {
            console.error("Error fetching categories:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getCategories()
    }, [])

    var settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 7,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        arrows: true,
        responsive: [
            {
                breakpoint: 1280,
                settings: {
                    slidesToShow: 5,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    arrows: false
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    arrows: false,
                    dots: false
                }
            }
        ]
    };

    if (loading) {
        return <LoadingScreen />
    }

    return (
        <div className="container mx-auto px-4 my-8">
            <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
            <Slider {...settings}>
                {categories.map((category, index) => (
                    <div className="px-2" key={index}>
                        <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
                            <div className="relative">
                                <img 
                                    src={category?.image} 
                                    className='w-full h-[150px] sm:h-[180px] object-cover' 
                                    alt={category?.name} 
                                />
                            </div>
                            <div className="p-3 text-center">
                                <h2 className="text-sm sm:text-base font-semibold text-gray-800 truncate">
                                    {category?.name}
                                </h2>
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    )
}
