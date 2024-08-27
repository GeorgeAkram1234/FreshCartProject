import React, { useContext, useState } from 'react'
import style from './Login.module.css'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../Contexts/AuthContext'



export default function Login() {

  const [loading, setLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)
  const navigate = useNavigate()
  const { setUserToken } = useContext(AuthContext)

  const validationSchema = Yup.object({

    email: Yup.string().email('email invalid').required('email is required'),
    password: Yup.string().matches(/^(?=.*\d)(?=.*[a-zA-Z]).{3,10}$/, 'password is invalid').required('password is required'),
  })

  const initialValues = {
    "email": "",
    "password": "",
  }

  let { handleSubmit, values, handleChange, errors, touched, handleBlur } = useFormik({
    initialValues,
    onSubmit,
    validationSchema
  })


  async function onSubmit() {
    setSuccessMsg('')
    setErrorMsg('')
    setLoading(true)
    await axios.post("https://ecommerce.routemisr.com/api/v1/auth/signin", values).then((response) => {
      setLoading(false)
      // setSuccessMsg(response.data.message)
      setUserToken(response.data.token)
      localStorage.setItem('token', response.data.token)
      console.log(response.data.token)
      if (location.pathname == '/login') {
        navigate('/')
      } else {
        navigate(location.pathname)
      }

    }).catch((err) => {
      setLoading(false)
      console.log(err.response.data.message)
      setErrorMsg(err.response.data.message)
    })

  }

  return <>

    <div className="py-20">

      <h1 className="text-3xl text-center">Login</h1>


      <form className="w-1/2 mx-auto capitalize" onSubmit={handleSubmit}>

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
        <button type="submit" className="text-white bg-emerald-700 hover:bg-emerald-800 focus:ring-4 focus:outline-none focus:ring-emerald-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:focus:ring-emerald-800 disabled:bg-gray-500" disabled={loading}>Submit {loading && <i className='fas fa-spin fa-spinner'></i>}</button>
        <div className='text-center'>
          {errorMsg && <p className='text-red-500  font-bold text-lg'>{errorMsg}</p>}
          {successMsg && <p className='text-green-500 font-bold text-lg'>{successMsg}</p>}

          <div className="flex justify-between my-3">
            <div>
              <Link to={'/forgetPass'}className='font-semibold hover:text-green-500 transition-all duration-200 cursor-pointer'>forgot your password?

              </Link>
            </div>
            <div>

              <span className='text-md text-gray-500 dark:text-gray-300'>Create New Account? </span>
              <Link to={"/register"} className='text-blue-500 hover:text-blue-600' >Register</Link>
            </div>
          </div>
        </div>
      </form>


    </div>
  </>
}
