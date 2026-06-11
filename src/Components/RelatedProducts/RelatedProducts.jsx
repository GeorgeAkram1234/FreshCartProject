import Slider from 'react-slick'
import Product from '../Product/Product';

export default function RelatedProducts({ products }) {

    var settings = {
        dots: false,
        infinite: false,
        speed: 200,
        slidesToShow: 4,
        slidesToScroll: 4,
        responsive: [
            {
              breakpoint: 1024,
              settings: {
                slidesToShow: 3,
                slidesToScroll: 3,
              }
            },
            {
              breakpoint: 600,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
              }
            },
            {
              breakpoint: 480,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1
              }
            }
          ]
    };

    return (
        <>
            <div className="mt-16">
                <h3 className="text-gray-600 text-2xl font-medium mb-4">More Products</h3>
                <Slider {...settings}>
                    {products.map((product) => (
                        <div key={product._id} className="px-2">
                             <Product product={product} />
                        </div>
                    ))}
                </Slider>
            </div>
        </>
    )
}
