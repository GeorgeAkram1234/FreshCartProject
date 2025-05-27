import React from 'react'
import slide1 from '../../assets/images/slider-image-1.jpeg'
import slide2 from '../../assets/images/slider-image-2.jpeg'
import slide3 from '../../assets/images/slider-image-3.jpeg'
import Slider from 'react-slick';

export default function MainSlider() {
    var settings = {
        dots: true,
        infinite: true,
        arrows: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    arrows: false
                }
            }
        ]
    };

    return (
        <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-4 my-5">
                <div className="w-full lg:w-3/4">
                    <Slider {...settings}>
                        <div className="relative">
                            <img src={slide1} className='w-full h-[200px] sm:h-[300px] md:h-[400px] object-cover rounded-lg' alt="Slide 1" />
                        </div>
                        <div className="relative">
                            <img src={slide2} className='w-full h-[200px] sm:h-[300px] md:h-[400px] object-cover rounded-lg' alt="Slide 2" />
                        </div>
                        <div className="relative">
                            <img src={slide3} className='w-full h-[200px] sm:h-[300px] md:h-[400px] object-cover rounded-lg' alt="Slide 3" />
                        </div>
                    </Slider>
                </div>
                <div className="w-full lg:w-1/4 flex flex-col gap-4">
                    <img src={slide1} className='w-full h-[150px] sm:h-[200px] object-cover rounded-lg' alt="Slide 1" />
                    <img src={slide2} className='w-full h-[150px] sm:h-[200px] object-cover rounded-lg' alt="Slide 2" />
                </div>
            </div>
        </div>
    )
}
