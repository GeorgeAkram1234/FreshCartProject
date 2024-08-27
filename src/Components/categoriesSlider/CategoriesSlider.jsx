import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Slider from 'react-slick'

export default function CategoriesSlider() {

    const [categories, setCategories] = useState([])


    async function getCategories() {
        try {
            let { data } = await axios.get(`https://ecommerce.routemisr.com/api/v1/categories`)
            setCategories(data.data)
            // console.log(data.data);

        } catch (error) {
            console.error("Error fetching categories:", error)
        }
    }


    useEffect(() => {
        getCategories()
    }, [])

    var settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 7,
        slidesToScroll: 4,
        autoplay: true,
        autoplaySpeed: 1000,
    };


    return (

        <>
            <Slider {...settings}>
                {categories.map((category, index) => (<div className="my-6"  key={index} >
                    <img src={category?.image} className='w-full h-[200px]' alt={category?.name} />
                    <h2>{category?.name}</h2>
                </div>
                ))}
            </Slider>
        </>
    )
}
