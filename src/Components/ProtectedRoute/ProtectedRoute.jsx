import { useContext } from 'react'
import { AuthContext } from '../../Contexts/AuthContext'
import { Navigate } from 'react-router-dom'

/* eslint-disable react/prop-types */
export default function ProtectedRoute({ children }) {
    const { userToken } = useContext(AuthContext)

    // Using Navigate instead of direct component rendering allows the Login component
    // to be correctly code-split and removed from the main bundle.
    return (
        <>
            {userToken ? children : <Navigate to="/login" />}
        </>
    )
}
