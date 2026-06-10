import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../../Contexts/AuthContext'

export default function ProtectedRoute({ children }) {
    const { userToken } = useContext(AuthContext)
    return (
        <>
            {userToken ? children : <Navigate to="/login" />}
        </>
    )
}
