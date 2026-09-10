import { useEffect, useState } from 'react'
import { 
  getProducts, 
  getCategories, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from '../services/api'
import type { Product } from '../types/product'
import './Products.css'
import type { Category } from '../types/category'

function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category_id: '',
    price: '',
  })
  const [editingProductId, setEditingProductId] = useState<number | null>(null)

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

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => {
        setError('No se pudieron cargar las categorías.')
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

        <button
          className="btn-primary"
          onClick={() => setShowForm(true)}
        >
          + Nuevo producto
        </button>
      </div>

      {showForm && (
        <div className="product-form">
          <h2>Nuevo producto</h2>

          <div className="form-group">
            <label>Nombre</label>
            {/* <input type="text" placeholder="Nombre del producto" /> */}
            <input
              type="text"
              placeholder="Nombre del producto"
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value,
                })
              }
            />
          </div>

          <div className="form-group">
            <label>Descripción</label>
            {/* <textarea placeholder="Descripción del producto" /> */}
            <textarea
              placeholder="Descripción del producto"
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value,
                })
              }
            />
          </div>

          <div className="form-group">
            <label>Categoría</label>

            {/* <select defaultValue=""> */}
            <select
              value={formData.category_id}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category_id: e.target.value,
                })
              }
            >
              <option value="" disabled>
                Selecciona una categoría
              </option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Precio</label>
            {/* <input type="number" placeholder="0.00" /> */}
            <input
              type="number"
              placeholder="0.00"
              value={formData.price}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  price: e.target.value,
                })
              }
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => setShowForm(false)}
            >
              Cancelar
            </button>

            {/* <button
              type="button"
              className="btn-primary"
            >
              Guardar producto
            </button> */}

            <button
              type="button"
              className="btn-primary"
              onClick={async () => {
                try {
                  if (editingProductId !== null) {
                    const updatedProduct = await updateProduct(editingProductId, {
                      name: formData.name,
                      description: formData.description,
                      category_id: Number(formData.category_id),
                      price: Number(formData.price),
                      is_available: true,
                    })

                    setProducts(
                      products.map((product) =>
                        product.id === editingProductId
                          ? updatedProduct
                          : product
                      )
                    )
                  } else {
                    const newProduct = await createProduct({
                      name: formData.name,
                      description: formData.description,
                      category_id: Number(formData.category_id),
                      price: Number(formData.price),
                      is_available: true,
                    })

                    setProducts([...products, newProduct])
                  }

                  setShowForm(false)
                  setEditingProductId(null)

                  setFormData({
                    name: '',
                    description: '',
                    category_id: '',
                    price: '',
                  })
                } catch (error) {
                  setError(
                    editingProductId !== null
                      ? 'No se pudo actualizar el producto.'
                      : 'No se pudo crear el producto.'
                  )
                }
              }}
            >
              Guardar producto
            </button>
          </div>
        </div>
      )}

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
                    {/* <button className="btn-edit">
                      Editar
                    </button> */}

                    <button
                      className="btn-edit"
                      onClick={() => {
                        setEditingProductId(product.id)
                        setShowForm(true)

                        setFormData({
                          name: product.name,
                          description: product.description ?? '',
                          category_id: String(product.category_id),
                          price: product.price,
                        })
                      }}
                    >
                      Editar
                    </button>

                    {/* <button className="btn-delete">
                      Eliminar
                    </button> */}
                    <button
                      className="btn-delete"
                      onClick={async () => {
                        const confirmed = window.confirm(
                          `¿Estás seguro de eliminar el producto "${product.name}"?`
                        )

                        if (!confirmed) {
                          return
                        }

                        try {
                          await deleteProduct(product.id)

                          setProducts(
                            products.filter((item) => item.id !== product.id)
                          )
                        } catch (error) {
                          setError('No se pudo eliminar el producto.')
                        }
                      }}
                    >
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