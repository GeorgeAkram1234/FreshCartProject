import React, { useContext } from 'react'
import { AuthContext } from '../../Contexts/AuthContext'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
    const { userToken } = useContext(AuthContext)

    // BOLT OPTIMIZATION: Use Navigate instead of direct component rendering.
    // This allows the Login component to be code-split and not included
    // in the bundle until the user actually hits the /login route.
    return (
        <>
            {userToken ? children : <Navigate to="/login" />}
        </>
    )
}
