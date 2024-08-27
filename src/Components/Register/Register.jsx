import React, { useState } from 'react'
import style from './Register.module.css'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'



export default function Register() {


  const [loading, setLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)
  const navigate = useNavigate()

  let { handleSubmit, values, handleChange, errors, touched, handleBlur } = useFormik({
    initialValues: {
      "name": "",
      "email": "",
      "password": "",
      "rePassword": "",
      "phone": ""
    },
    onSubmit: onSubmit,
    validationSchema: Yup.object({
      name: Yup.string().min(3, 'Name must be more than 3 characters').max(20, 'Name must be less than 20 characters').required('name is required'),
      email: Yup.string().email('email invalid').required('email is required'),
      password: Yup.string().matches(/^(?=.*\d)(?=.*[a-zA-Z]).{3,10}$/, 'password is invalid').required('password is required'),
      rePassword: Yup.string().oneOf([Yup.ref('password')], "passwords don't match").required('password is required'),
      phone: Yup.string().matches(/(002)?[0125][0-9]{8}$/, ' (egyptian) phone number is required').required('phone is required')
    })
  })


  async function onSubmit() {
    setErrorMsg('')
    setSuccessMsg('')
    setLoading(true)
    await axios.post("https://ecommerce.routemisr.com/api/v1/auth/signup", values).then((response) => {
      setLoading(false)
      console.log(response.data)
      setSuccessMsg(response.data.message)
      setTimeout(() => {
        navigate('/login')
      }, 1000);
    }).catch((err) => {
      setLoading(false)
      console.log(err.response.data.message)
      setErrorMsg(err.response.data.message)

    })
    setLoading(false)
  }

  return <>

    <div className="py-20">

      <h1 className="text-3xl text-center">Register</h1>


      <form className="w-1/2 mx-auto capitalize" onSubmit={handleSubmit}>
        <div className="relative z-0 w-full mb-5 group">
          <input onBlur={handleBlur} onChange={handleChange} value={values.name} type="text" name="name" id="name" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-emerald-500 focus:outline-none focus:ring-0 focus:border-emerald-600 peer" placeholder=" " />
          <label htmlFor="name" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-emerald-600 peer-focus:dark:text-emerald-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Enter your Name</label>
          {touched.name && errors.name && <p className='text-red-600'>{errors.name}</p>}
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input onBlur={handleBlur} onChange={handleChange} value={values.email} type="email" name="email" id="email" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-emerald-500 focus:outline-none focus:ring-0 focus:border-emerald-600 peer" placeholder=" " />
          <label htmlFor="email" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-emerald-600 peer-focus:dark:text-emerald-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Enter Your mail</label>
          {touched.email && errors.email && <p className='text-red-600'>{errors.email}</p>}
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input onBlur={handleBlur} onChange={handleChange} value={values.password} type="password" name="password" id="password" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-emerald-500 focus:outline-none focus:ring-0 focus:border-emerald-600 peer" placeholder=" " />
          <label htmlFor="password" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-emerald-600 peer-focus:dark:text-emerald-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 ">enter your password</label>
          {touched.password && errors.password && <p className='text-red-600'>{errors.password}</p>}
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input onBlur={handleBlur} onChange={handleChange} value={values.rePassword} type="password" name="rePassword" id="rePassword" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-emerald-500 focus:outline-none focus:ring-0 focus:border-emerald-600 peer" placeholder=" " />
          <label htmlFor="rePassword" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-emerald-600 peer-focus:dark:text-emerald-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Confirm password</label>
          {touched.rePassword && errors.rePassword && <p className='text-red-600'>{errors.rePassword}</p>}
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input onBlur={handleBlur} onChange={handleChange} value={values.phone} type="tel" name="phone" id="phone" className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-emerald-500 focus:outline-none focus:ring-0 focus:border-emerald-600 peer" placeholder=" " />
          <label htmlFor="phone" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-emerald-600 peer-focus:dark:text-emerald-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Enter your phone</label>
          {touched.phone && errors.phone && <p className='text-red-600'>{errors.phone}</p>}
        </div>
        <button type="submit" className="text-white bg-emerald-700 hover:bg-emerald-800 focus:ring-4 focus:outline-none focus:ring-emerald-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:focus:ring-emerald-800 disabled:bg-gray-400" disabled={loading}>Submit {loading && <i className='fas fa-spinner fa-spin'></i>}</button>
        <div className='text-center'>
          {errorMsg && <p className='text-red-500  font-bold text-lg'>{errorMsg}</p>}
          {successMsg && <p className='text-green-500 font-bold text-lg'>{successMsg}</p>}


          <span className='text-md text-gray-500 dark:text-gray-300'>Already have an account? </span>
          <Link to={"/login"} className='text-blue-500 hover:text-blue-600'>login</Link>
        </div>
      </form>


    </div>
  </>
}
