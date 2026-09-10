import type { Product } from '../types/product'
import './Products.css'

function Products() {
  const products: Product[] = [
    {
      id: 8,
      category_id: 39,
      name: 'Pique macho',
      description: null,
      price: '50.00',
      is_available: true,
      category: {
        id: 39,
        name: 'sopas',
      },
    },
    {
      id: 1,
      category_id: 1,
      name: 'Pizza Familiar',
      description: 'Pizza familiar de especialidad de El Rodeo',
      price: '80.00',
      is_available: true,
      category: {
        id: 1,
        name: 'Pizzas',
      },
    },
    {
      id: 7,
      category_id: 39,
      name: 'Sopa de maní',
      description: null,
      price: '25.00',
      is_available: true,
      category: {
        id: 39,
        name: 'sopas',
      },
    },
  ]

  return (
    <section className="products">
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