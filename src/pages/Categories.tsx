import { useEffect, useState } from 'react'
import { getCategories } from '../services/api'
import type { Category } from '../types/category'
import './Categories.css'

function Categories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => {
        setError('No se pudieron cargar las categorías.')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return (
    // <section>
    //   <h1>Categorías</h1>

    //   {loading && <p>Cargando categorías...</p>}

    //   {error && <p>{error}</p>}

    //   {!loading && !error && (
    //     <ul>
    //       {categories.map((category) => (
    //         <li key={category.id}>
    //           <strong>{category.name}</strong>
    //           <p>{category.description}</p>
    //         </li>
    //       ))}
    //     </ul>
    //   )}
    // </section>

    <section className="categories">
      <div className="categories-header">
      <span className="categories-label">GESTIÓN DE CATEGORÍAS</span>

        <h1>Categorías</h1>

        <p>
          Administra y consulta las categorías de productos del restaurante.
        </p>
      </div>

      {loading && <p>Cargando categorías...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && (
        <div className="categories-table-container">
          <table className="categories-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Estado</th>
              </tr>
            </thead>

            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td>{category.id}</td>

                  <td>
                    <strong>{category.name}</strong>
                  </td>

                  <td className="category-description">
                    {category.description || 'Sin descripción'}
                  </td>

                  <td>
                    <span
                      className={`status ${
                        category.is_active ? 'active' : 'inactive'
                      }`}
                    >
                      {category.is_active ? 'Activa' : 'Inactiva'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default Categories