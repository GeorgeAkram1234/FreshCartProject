import React, { useState } from 'react'
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
      setSuccessMsg(response.data.message)
      setTimeout(() => {
        navigate('/login')
      }, 1000);
    }).catch((err) => {
      setLoading(false)
      setErrorMsg(err.response.data.message)
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-primary py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-dark-secondary p-8 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-[1.02]">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Join our community today
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div className="relative group">
              <input
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.name}
                type="text"
                name="name"
                id="name"
                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-dark-primary focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                placeholder="Full name"
              />
              {touched.name && errors.name && (
                <p className="mt-1 text-sm text-red-500 transform transition-all duration-200">{errors.name}</p>
              )}
            </div>

            <div className="relative group">
              <input
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                type="email"
                name="email"
                id="email"
                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-dark-primary focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                placeholder="Email address"
              />
              {touched.email && errors.email && (
                <p className="mt-1 text-sm text-red-500 transform transition-all duration-200">{errors.email}</p>
              )}
            </div>

            <div className="relative group">
              <input
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                type="password"
                name="password"
                id="password"
                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-dark-primary focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                placeholder="Password"
              />
              {touched.password && errors.password && (
                <p className="mt-1 text-sm text-red-500 transform transition-all duration-200">{errors.password}</p>
              )}
            </div>

            <div className="relative group">
              <input
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.rePassword}
                type="password"
                name="rePassword"
                id="rePassword"
                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-dark-primary focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                placeholder="Confirm password"
              />
              {touched.rePassword && errors.rePassword && (
                <p className="mt-1 text-sm text-red-500 transform transition-all duration-200">{errors.rePassword}</p>
              )}
            </div>

            <div className="relative group">
              <input
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.phone}
                type="tel"
                name="phone"
                id="phone"
                className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-dark-primary focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                placeholder="Phone number"
              />
              {touched.phone && errors.phone && (
                <p className="mt-1 text-sm text-red-500 transform transition-all duration-200">{errors.phone}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transform transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <i className="fas fa-spinner fa-spin mr-2"></i>
              ) : (
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <i className="fas fa-user-plus text-emerald-500 group-hover:text-emerald-400 transition-colors duration-200"></i>
                </span>
              )}
              Create Account
            </button>
          </div>

          {errorMsg && (
            <div className="rounded-md bg-red-50 dark:bg-red-900/50 p-4 transform transition-all duration-200">
              <p className="text-sm text-red-700 dark:text-red-200">{errorMsg}</p>
            </div>
          )}

          {successMsg && (
            <div className="rounded-md bg-green-50 dark:bg-green-900/50 p-4 transform transition-all duration-200">
              <p className="text-sm text-green-700 dark:text-green-200">{successMsg}</p>
            </div>
          )}

          <div className="text-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 transition-colors duration-200">
                Sign in
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  )
}
