import { useEffect, useState } from 'react'
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../services/api'
import type { Category } from '../types/category'
import './Categories.css'

function Categories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [showForm, setShowForm] = useState(false)
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
  })

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

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
    })

    setEditingCategoryId(null)
    setShowForm(false)
  }

  const handleSaveCategory = async () => {
    try {
      if (editingCategoryId !== null) {
        const updatedCategory = await updateCategory(
          editingCategoryId,
          {
            name: formData.name,
            description: formData.description,
            is_active: true,
          }
        )

        setCategories(
          categories.map((category) =>
            category.id === editingCategoryId
              ? updatedCategory
              : category
          )
        )
      } else {
        const newCategory = await createCategory({
          name: formData.name,
          description: formData.description,
          is_active: true,
        })

        setCategories([...categories, newCategory])
      }

      resetForm()
    } catch (error) {
      setError(
        editingCategoryId !== null
          ? 'No se pudo actualizar la categoría.'
          : 'No se pudo crear la categoría.'
      )
    }
  }

  const handleDeleteCategory = async (category: Category) => {
    const confirmed = window.confirm(
      `¿Estás seguro de eliminar la categoría "${category.name}"?`
    )

    if (!confirmed) {
      return
    }

    try {
      await deleteCategory(category.id)

      setCategories(
        categories.filter((item) => item.id !== category.id)
      )
    } catch (error) {
      setError('No se pudo eliminar la categoría.')
    }
  }

  return (
    <section className="page categories">
      <div className="page-header categories-header">
        <div>
          {/* <span className="products-label">GESTIÓN</span>
          <h1>Productos</h1>
          <p>
            Administra los productos disponibles en el restaurante El Rodeo.
          </p> */}
          <span className="page-label categories-label">
            GESTIÓN DE CATEGORÍAS
          </span>

          <h1>Categorías</h1>

          <p>
            Administra y consulta las categorías de productos del restaurante.
          </p>
        </div>

        <button
          className="btn-primary"
          onClick={() => setShowForm(true)}
        >
          + Nueva categoría
        </button>
      </div>

      {showForm && (
        <div className="page-form category-form">
          <h2>
            {editingCategoryId !== null
              ? 'Editar categoría'
              : 'Nueva categoría'}
          </h2>

          <div className="form-group">
            <label>Nombre</label>

            <input
              type="text"
              placeholder="Nombre de la categoría"
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

            <textarea
              placeholder="Descripción de la categoría"
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value,
                })
              }
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={resetForm}
            >
              Cancelar
            </button>

            <button
              type="button"
              className="btn-primary"
              onClick={handleSaveCategory}
            >
              {editingCategoryId !== null
                ? 'Actualizar categoría'
                : 'Guardar categoría'}
            </button>
          </div>
        </div>
      )}

      {loading && <p>Cargando categorías...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && (
        <div className="table-container categories-table-container">
          <table className="table categories-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Estado</th>
                <th>Acciones</th>
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
                        category.is_active
                          ? 'active'
                          : 'inactive'
                      }`}
                    >
                      {category.is_active
                        ? 'Activa'
                        : 'Inactiva'}
                    </span>
                  </td>

                  <td className="table-actions category-actions">
                    <button
                      className="btn-edit"
                      onClick={() => {
                        setEditingCategoryId(category.id)
                        setShowForm(true)

                        setFormData({
                          name: category.name,
                          description:
                            category.description ?? '',
                        })
                      }}
                    >
                      Editar
                    </button>

                    <button
                      className="btn-delete"
                      onClick={() =>
                        handleDeleteCategory(category)
                      }
                    >
                      Eliminar
                    </button>
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
