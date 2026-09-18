import { NavLink, useNavigate } from 'react-router-dom'
import './Navbar2.css'

interface AuthUser {
  name: string
  role: string
}

function Navbar() {
  const navigate = useNavigate()

  const userData = localStorage.getItem('user')
  let user: AuthUser | null = null

  if (userData) {
    try {
      user = JSON.parse(userData)
    } catch {
      user = null
    }
  }

  const isAdmin = user?.role === 'admin'

  const roleLabels: Record<string, string> = {
    admin: 'Administrador',
    mesero: 'Mesero',
    cocina: 'Cocina',
  }

  const roleLabel = user
    ? roleLabels[user.role] ?? user.role
    : ''

  const handleLogout = async () => {
    const token = localStorage.getItem('token')

    try {
      await fetch('http://localhost:8000/api/logout', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      navigate('/login')
    }
  }

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <span className="navbar-logo">ER</span>

        <div>
          <h1>El Rodeo</h1>
          <span>Sistema de gestión</span>
        </div>
      </div>

      <nav className="navbar-links">
        <NavLink to="/">Inicio</NavLink>
        <NavLink to="/pedidos">Pedidos</NavLink>

        {isAdmin && (
          <>
            <NavLink to="/productos">Productos</NavLink>
            <NavLink to="/categorias">Categorías</NavLink>
            <NavLink to="/mesas">Mesas</NavLink>
            <NavLink to="/usuarios">Usuarios</NavLink>
          </>
        )}

        {user && (
          <div className="navbar-user">
            <strong>{user.name}</strong>
            <span>{roleLabel}</span>
          </div>
        )}

        <button
          type="button"
          className="navbar-logout"
          onClick={handleLogout}
        >
          Cerrar sesión
        </button>
      </nav>
    </header>
  )
}

export default Navbar
