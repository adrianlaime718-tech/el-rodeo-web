import { NavLink } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-brand">
        <span className="navbar-logo">ER</span>

        <div>
          <h1>El Rodeo</h1>
          <span>Sistema de gestión</span>
        </div>
      </div>

      <nav className="navbar-menu">
        <NavLink to="/">Inicio</NavLink>
        <NavLink to="/productos">Productos</NavLink>
        <NavLink to="/categorias">Categorías</NavLink>
        <NavLink to="/pedidos">Pedidos</NavLink>
      </nav>
    </header>
  )
}

export default Navbar