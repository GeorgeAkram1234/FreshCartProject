import { useContext } from 'react'
import { AuthContext } from '../../Contexts/AuthContext'
import Login from '../Login/Login'

/* eslint-disable react/prop-types */
export default function ProtectedRoute({ children }) {
    const { userToken } = useContext(AuthContext)
    return (
        <>
            {userToken ? children : <Login />}
        </>
    )
}
