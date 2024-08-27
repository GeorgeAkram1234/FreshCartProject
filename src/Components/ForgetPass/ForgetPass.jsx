import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'

export default function ForgetPass() {
    let navigate = useNavigate()
    const [successMsg, setSuccessMsg] = useState(null)
    const [errorMsg, setErrorMsg] = useState(null)

    const validationSchema = Yup.object({

        email: Yup.string().email('email invalid').required('email is required'),
    })

    const initialValues = {
        "email": "",
    }

    let { handleSubmit, values, handleChange, errors, touched, handleBlur } = useFormik({
        initialValues,
        onSubmit,
        validationSchema
    })

    async function onSubmit() {
        setSuccessMsg('')
        setErrorMsg('')
        await axios.post("https://ecommerce.routemisr.com/api/v1/auth/forgotPasswords", values).then((response) => {
            console.log(response.data.statusMsg)
            if (response.data.statusMsg == 'success') {
                navigate('/verifyCode')
            } 

        }).catch((err) => {
            console.log(err.response.data.statusMsg)
            setErrorMsg(err.response.data.statusMsg)
        })

    }



    return (
        <>
            <div className="h-screen p-6">
                <div className='w-3/4 mx-auto'>
                    <form onSubmit={handleSubmit}>
                        <h1 className="text-3xl font-bold mb-4">please enter your verification code</h1>
                        <input onChange={handleChange} onBlur={handleBlur}
                            type="email"
                            id='email'
                            name="email"
                            placeholder="Email"
                            className='w-full p-5 rounded-md outline outline-2 outline-gray-500'
                        />
                        {touched.email && errors.email && <p className='text-red-600'>{errors.email}</p>}


                        {errorMsg && <p className='text-red-500  font-bold text-lg'>{errorMsg}</p>}
                        {successMsg && <p className='text-green-500 font-bold text-lg'>{successMsg}</p>}
                        <button type='submit' className="bg-green-500 my-3 px-4 py-2 transition-all duration-300 hover:bg-green-700 text-white font-bold rounded-md">
                            send verification code
                        </button>

                    </form>

                </div>
            </div>
        </>
    )
}
