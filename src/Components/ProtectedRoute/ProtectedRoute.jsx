/* eslint-disable react/prop-types */
import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../../Contexts/AuthContext'

export default function ProtectedRoute({ children }) {
    const { userToken } = useContext(AuthContext)

    if (userToken) {
        return <>{children}</>
    } else {
        return <Navigate to="/login" />
    }
}
