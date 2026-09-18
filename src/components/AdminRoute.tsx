import { Navigate, Outlet } from 'react-router-dom'

function AdminRoute() {
  const token = localStorage.getItem('token')
  const userData = localStorage.getItem('user')

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (!userData) {
    return <Navigate to="/login" replace />
  }

  try {
    const user = JSON.parse(userData)

    if (user.role !== 'admin') {
      return <Navigate to="/" replace />
    }

    return <Outlet />
  } catch {
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    return <Navigate to="/login" replace />
  }
}

export default AdminRoute
