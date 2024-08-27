// import React, { useContext, useEffect, useState } from 'react'
// import style from './Categories.module.css'
// import { Helmet } from 'react-helmet'
// import { AuthContext } from '../../Contexts/AuthContext'
// import axios from 'axios'
// import LoadingScreen from '../LoadingScreen/LoadingScreen'
// import { Link } from 'react-router-dom'

// export default function Categories() {

//   const [categories, setCategories] = useState([])
//   const [subCategories, setSubCategories] = useState([])

//   const [loading, setLoading] = useState(false)


//   async function getCategories() {
//     setLoading(true)
//     let { data } = await axios.get(`https://ecommerce.routemisr.com/api/v1/categories`)
//     setLoading(false)
//     console.log(data.data);
//     setCategories(data.data)
//   }


//   useEffect(() => {
//     getCategories()
//   }, [])


//   async function getSubCategories() {
//     setLoading(true)
//     let { data } = await axios.get(`https://ecommerce.routemisr.com/api/v1/subcategories`)
//     setLoading(false)
//     console.log(data.data);
//     setSubCategories(data.data)
// }


// useEffect(() => {
//     getSubCategories()
// }, [])


//   return <>
//     <h1 className='text-3xl text-center font-semibold'>categories</h1>

//     <div className='  p-6'>
//       {!loading ? <div className='container mx-auto grid md:grid-cols-3 grid-cols-1 gap-3 '>
//         {categories.map((category, index) => {
//           return <>
//               <div key={index} className='border border-solid rounded-lg hover:shadow-md transition-all duration-300' >
//                 <img src={category?.image} className='w-full object-contain h-64' alt={category?.name} />
//                 <h2 className='text-2xl text-center p-3 text-green-600 font-bold'>{category?.name}</h2>
//               </div>

//           </>
//         }
//         )}
//       </div> : <LoadingScreen />}
//     </div>

//         <h1 className='text-3xl text-center font-semibold'>subcategories</h1>

//     <div className='  p-6'>
//       {!loading ? <div className='container mx-auto grid md:grid-cols-3 grid-cols-1 gap-3 '>
//         {subCategories.map((subcategory, index) => {
//           return <>
//             <div key={index} className='border border-solid rounded-lg hover:shadow-md transition-all duration-300' >
//               <h2 className='text-2xl text-center p-3 text-green-600 font-bold'>{subcategory?.name}</h2>
//             </div>
//           </>
//         }
//         )}
//       </div> : <LoadingScreen />}
//     </div>



//     <Helmet>
//       <title>Categories</title>
//     </Helmet>

//   </>
// }


import React, { useContext, useEffect, useState } from 'react';
import style from './Categories.module.css';
import { Helmet } from 'react-helmet';
import { AuthContext } from '../../Contexts/AuthContext';
import axios from 'axios';
import LoadingScreen from '../LoadingScreen/LoadingScreen';
import { Link } from 'react-router-dom';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  // Fetch categories on component mount
  async function getCategories() {
    setLoading(true);
    try {
      const { data } = await axios.get(`https://ecommerce.routemisr.com/api/v1/categories`);
      setCategories(data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
    setLoading(false);
  }

  useEffect(() => {
    getCategories();
  }, []);

  // Fetch subcategories based on the clicked category
  async function getSubCategories(categoryId) {
    setLoading(true);
    try {
      const { data } = await axios.get(`https://ecommerce.routemisr.com/api/v1/subcategories`, {
        params: { category: categoryId }
      });
      setSubCategories(data.data);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
    setLoading(false);
  }

  const handleCategoryClick = (categoryId) => {
    setSelectedCategoryId(categoryId);
    getSubCategories(categoryId);
  };

  return (
    <>
      <h1 className='text-3xl text-center font-semibold'>Categories</h1>

      <div className='p-6'>
        {!loading ? (
          <div className='container mx-auto grid md:grid-cols-3 grid-cols-1 gap-3 '>
            {categories.map((category, index) => (
              <div 
                key={index}
                className='border border-solid rounded-lg hover:shadow-md transition-all duration-300 cursor-pointer'
                onClick={() => handleCategoryClick(category._id)} // Use the category ID here
              >
                <img src={category?.image} className='w-full object-contain h-64' alt={category?.name} />
                <h2 className='text-2xl text-center p-3 text-green-600 font-bold'>{category?.name}</h2>
              </div>
            ))}
          </div>
        ) : (
          <LoadingScreen />
        )}
      </div>

      <h1 className='text-3xl text-center font-semibold'>Subcategories</h1>

      <div className='p-6'>
        {!loading ? (
          <div className='container mx-auto grid md:grid-cols-3 grid-cols-1 gap-3 '>
            {subCategories.map((subcategory, index) => (
              <div key={index} className='border border-solid rounded-lg hover:shadow-md transition-all duration-300'>
                <h2 className='text-2xl text-center p-3 text-green-600 font-bold'>{subcategory?.name}</h2>
              </div>
            ))}
          </div>
        ) : (
          <LoadingScreen />
        )}
      </div>

      <Helmet>
        <title>Categories</title>
      </Helmet>
    </>
  );
}
