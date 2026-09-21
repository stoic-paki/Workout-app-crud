import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
  const userAuth = localStorage.getItem("userAuth")
  const authUser = JSON.parse(userAuth)

  if (!authUser?.isLogin) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute