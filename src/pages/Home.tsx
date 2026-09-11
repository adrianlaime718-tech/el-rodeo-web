import { Link } from 'react-router-dom'
import './Home.css'

function Home() {
  return (
    <section className="page home">
      <div className="page-header home-header">
        <div>
          <span className="page-label home-label">RESTAURANTE EL RODEO</span>
          <h1>Bienvenido al sistema de gestión</h1>
          <p>
            Administra los productos, categorías y pedidos del restaurante
            desde un solo lugar.
          </p>
        </div>
      </div>

      <div className="dashboard-cards">
        <Link to="/productos" className="dashboard-card">
          <div className="card-icon">🍽️</div>
          <h2>Productos</h2>
          <p>Consulta y administra los productos disponibles.</p>
          <span>Ver productos →</span>
        </Link>

        <Link to="/categorias" className="dashboard-card">
          <div className="card-icon">📋</div>
          <h2>Categorías</h2>
          <p>Organiza los productos según sus categorías.</p>
          <span>Ver categorías →</span>
        </Link>

        <Link to="/pedidos" className="dashboard-card">
          <div className="card-icon">🛎️</div>
          <h2>Pedidos</h2>
          <p>Consulta y gestiona los pedidos del restaurante.</p>
          <span>Ver pedidos →</span>
        </Link>
      </div>
    </section>
  )
}

export default Home