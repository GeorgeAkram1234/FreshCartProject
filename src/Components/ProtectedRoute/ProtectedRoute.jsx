import { useContext } from 'react'
import { AuthContext } from '../../Contexts/AuthContext'
import { Navigate } from 'react-router-dom'
import PropTypes from 'prop-types'

export default function ProtectedRoute({ children }) {
    const {userToken}= useContext(AuthContext)
    return (
        <>
            {userToken ? children : <Navigate to="/login" />}
        </>
    )
}

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired
}
