import { useContext } from 'react'
import { AuthContext } from '../../Contexts/AuthContext'
import { Navigate } from 'react-router-dom'

/* eslint-disable react/prop-types */
export default function ProtectAuthRoutes({ children }) {
    const { userToken } = useContext(AuthContext)
    return (
        <>
        {!userToken ? children : <Navigate to={'/'} />}
        </>
    )
}
