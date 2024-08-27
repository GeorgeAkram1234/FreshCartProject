import React, { useEffect, useState } from 'react';
import style from './Brands.module.css';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import LoadingScreen from '../LoadingScreen/LoadingScreen';

export default function Brands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false); // State to manage popup visibility
  const [selectedBrand, setSelectedBrand] = useState(null); // State to store selected brand details

  async function getBrands() {
    setLoading(true);
    try {
      const { data } = await axios.get(`https://ecommerce.routemisr.com/api/v1/brands`);
      setBrands(data.data);
    } catch (error) {
      console.error('Error fetching brands:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getBrands();
  }, []);

  // Function to handle brand click and show popup
  const handleBrandClick = (brand) => {
    setSelectedBrand(brand);
    setShowPopup(true);
  };

  // Function to close popup
  const closePopup = () => {
    setShowPopup(false);
    setSelectedBrand(null); // Clear selected brand when closing popup
  };

  return (
    <>
      <h1 className="text-3xl text-center font-semibold">Brands</h1>

      <div className="p-6">
        {!loading ? (
          <div className="container mx-auto grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-3">
            {brands.map((brand, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg p-4 hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => handleBrandClick(brand)} // Handle click event
              >
                <img src={brand.image} alt={brand.slug} className="w-full object-contain" />
                <h2 className="text-lg font-semibold text-center">{brand.slug}</h2>
              </div>
            ))}
          </div>
        ) : (
          <LoadingScreen />
        )}
      </div>

      {/* Popup component */}
      {showPopup && selectedBrand && (
        <div className={style.popup} onClick={closePopup}>
          <div className={style.popupContent} onClick={(e) => e.stopPropagation()}>
            <span className={style.close} onClick={closePopup}>&times;</span>
            <img src={selectedBrand.image} alt={selectedBrand.slug} className="w-full object-contain" />
            <h2>{selectedBrand.slug}</h2>
            <button className={style.closeButton} onClick={closePopup}>Close</button> {/* Close button below brand name */}
          </div>
        </div>
      )}

      <Helmet>
        <title>Brands</title>
      </Helmet>
    </>
  );
}
