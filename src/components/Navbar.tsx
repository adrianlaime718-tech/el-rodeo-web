// import { NavLink } from 'react-router-dom'
import { NavLink, useNavigate } from 'react-router-dom'
// import './Navbar.css'
import './Navbar2.css'

// function Navbar() {
//   return (
    // <header className="navbar">
    //   <div className="navbar-brand">
    //     <span className="navbar-logo">ER</span>

    //     <div>
    //       <h1>El Rodeo</h1>
    //       <span>Sistema de gestión</span>
    //     </div>
    //   </div>

    //   <nav className="navbar-menu">
    //     <NavLink to="/">Inicio</NavLink>
    //     <NavLink to="/productos">Productos</NavLink>
    //     <NavLink to="/categorias">Categorías</NavLink>
    //     <NavLink to="/pedidos">Pedidos</NavLink>
    //   </nav>
    // </header>
//   )
// }

function Navbar() {
  const navigate = useNavigate()

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
    // <nav className="navbar">
    //   <div className="navbar-brand">
    //     <span>EL RODEO</span>
    //   </div>

    //   <div className="navbar-links">
    //     {/* <a href="/">Inicio</a>
    //     <a href="/productos">Productos</a>
    //     <a href="/categorias">Categorías</a>
    //     <a href="/pedidos">Pedidos</a> */}
    //     <NavLink to="/">Inicio</NavLink>
    //     <NavLink to="/productos">Productos</NavLink>
    //     <NavLink to="/categorias">Categorías</NavLink>
    //     <NavLink to="/pedidos">Pedidos</NavLink>

    //     <button
    //       type="button"
    //       className="navbar-logout"
    //       onClick={handleLogout}
    //     >
    //       Cerrar sesión
    //     </button>
    //   </div>
    // </nav>
    
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
        <NavLink to="/productos">Productos</NavLink>
        <NavLink to="/categorias">Categorías</NavLink>
        <NavLink to="/pedidos">Pedidos</NavLink>

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