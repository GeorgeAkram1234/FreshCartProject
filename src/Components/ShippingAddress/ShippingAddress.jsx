import React, { useContext, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AuthContext } from '../../Contexts/AuthContext'



export default function ShippingAddress() {

    const {cartId} = useParams()
    console.log(cartId);


    
    const [loading, setLoading] = useState(false)
    const { userToken } = useContext(AuthContext)

    const validationSchema = Yup.object({

        city: Yup.string().required('city is required'),
        phone: Yup.string().required('phone is required'),
        details: Yup.string().required('details are required'),
    })

    const initialValues = {
        "city": "",
        "phone": "",
        "details": ""
    }

    let { handleSubmit, values, handleChange, errors, touched, handleBlur } = useFormik({
        initialValues,
        onSubmit,
        validationSchema
    })


    async function onSubmit() {

        setLoading(true)
        console.log(values);

        await axios.post("https://ecommerce.routemisr.com/api/v1/orders/checkout-session/" + cartId, { ShippingAddress: values },
            {
                headers: {
                    token: userToken
                },
                params:{
                    url: 'http://localhost:5173'
                }
            }
        ).then(({ data }) => {
            setLoading(false)
            location.href = data.session.url
        }).catch((err) => {
            setLoading(false)
        })
    }



    return <>

        <div className="py-20">

            <h1 className="text-3xl text-center">Check Out</h1>


            <form className="w-1/2 mx-auto capitalize" onSubmit={handleSubmit}>

                <div className="relative z-0 w-full mb-5 group">
                    <input onBlur={handleBlur} onChange={handleChange} value={values.city} type="text" name="city" id="city" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-emerald-500 focus:outline-none focus:ring-0 focus:border-emerald-600 peer" placeholder=" " />
                    <label htmlFor="text" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-emerald-600 peer-focus:dark:text-emerald-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Enter Your city</label>
                    {touched.city && errors.city && <p className='text-red-600'>{errors.city}</p>}
                </div>

                <div className="relative z-0 w-full mb-5 group">
                    <input onBlur={handleBlur} onChange={handleChange} value={values.details} type="text" name="details" id="details" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-emerald-500 focus:outline-none focus:ring-0 focus:border-emerald-600 peer" placeholder=" " />
                    <label htmlFor="text" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-emerald-600 peer-focus:dark:text-emerald-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Enter Your details</label>
                    {touched.details && errors.details && <p className='text-red-600'>{errors.details}</p>}
                </div>

                <div className="relative z-0 w-full mb-5 group">
                    <input onBlur={handleBlur} onChange={handleChange} value={values.phone} type="tel" name="phone" id="phone" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-emerald-500 focus:outline-none focus:ring-0 focus:border-emerald-600 peer" placeholder=" " />
                    <label htmlFor="text" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-emerald-600 peer-focus:dark:text-emerald-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Enter Your phone</label>
                    {touched.phone && errors.phone && <p className='text-red-600'>{errors.phone}</p>}
                </div>


                <button type="submit" className="text-white bg-emerald-700 hover:bg-emerald-800 focus:ring-4 focus:outline-none focus:ring-emerald-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:focus:ring-emerald-800 disabled:bg-gray-500" disabled={loading}>CheckOut {loading && <i className='fas fa-spin fa-spinner'></i>}</button>

            </form>


        </div>
    </>
}
