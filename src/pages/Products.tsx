import { useEffect, useState } from 'react'
import { getProducts } from '../services/api'
import type { Product } from '../types/product'
import './Products.css'

function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(() => {
        setError('No se pudieron cargar los productos.')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return (
    <section className="products">

      {loading && <p>Cargando productos...</p>}

      {error && <p>{error}</p>}

      <div className="products-header">
        <div>
          <span className="products-label">GESTIÓN</span>
          <h1>Productos</h1>
          <p>
            Administra los productos disponibles en el restaurante El Rodeo.
          </p>
        </div>

        <button className="btn-primary">
          + Nuevo producto
        </button>
      </div>

      <div className="products-table-container">
        <table className="products-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Disponibilidad</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  <strong>{product.name}</strong>
                </td>

                {/* <td>{product.category}</td> */}
                <td>{product.category.name}</td>

                <td>
                  Bs. {Number(product.price).toFixed(2)}
                </td>

                <td>
                  <span
                    className={
                      product.is_available
                        ? 'status available'
                        : 'status unavailable'
                    }
                  >
                    {product.is_available ? 'Disponible' : 'No disponible'}
                  </span>
                </td>

                <td>
                  <div className="table-actions">
                    <button className="btn-edit">
                      Editar
                    </button>

                    <button className="btn-delete">
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default Products