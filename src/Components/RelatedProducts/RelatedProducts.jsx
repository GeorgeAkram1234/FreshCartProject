import Slider from 'react-slick'
import Product from '../Product/Product';


export default function RelatedProducts({ products }) {
    
    var settings = {
        dots: false,
        infinite: false,
        speed: 200,
        slidesToShow: 5,
        slidesToScroll: 4
    };

    return (
        <>
            <div className="mt-16">
                <h3 className="text-gray-600 text-2xl font-medium">More Products</h3>
                <Slider {...settings}>
                    {products?.map((product) => {
                        return (
                            <Product key={product.id || product._id} product={product} />
                        )
                    })}
                </Slider>
            </div>
        </>
    )
}
