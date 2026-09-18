import { useEffect, useState } from 'react'
import {
  createTable,
  getTables,
  updateTable,
} from '../services/api'
import type { Table } from '../types/table'
import './Tables.css'

type TableForm = {
  name: string
  is_active: boolean
}

const emptyForm: TableForm = {
  name: '',
  is_active: true,
}

function Tables() {
  const [tables, setTables] = useState<Table[]>([])
  const [formData, setFormData] = useState<TableForm>(emptyForm)
  const [editingTable, setEditingTable] = useState<Table | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const loadTables = async () => {
    try {
      setLoading(true)
      setError('')

      const data = await getTables()
      setTables(data)
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'No se pudieron cargar las mesas'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTables()
  }, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target

    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const resetForm = () => {
    setFormData(emptyForm)
    setEditingTable(null)
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setSaving(true)
    setError('')
    setSuccess('')

    try {
      if (editingTable) {
        const updatedTable = await updateTable(editingTable.id, {
          name: formData.name,
          is_active: formData.is_active,
        })

        setTables((current) =>
          current.map((table) =>
            table.id === updatedTable.id ? updatedTable : table
          )
        )

        setSuccess('Mesa actualizada correctamente.')
      } else {
        const newTable = await createTable({
          name: formData.name,
          is_active: formData.is_active,
        })

        setTables((current) =>
          [...current, newTable].sort((a, b) =>
            a.name.localeCompare(b.name)
          )
        )

        setSuccess('Mesa creada correctamente.')
      }

      resetForm()
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'No se pudo guardar la mesa'
      )
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (table: Table) => {
    setEditingTable(table)
    setFormData({
      name: table.name,
      is_active: table.is_active,
    })
    setError('')
    setSuccess('')
  }

  const handleToggleActive = async (table: Table) => {
    setError('')
    setSuccess('')

    try {
      const updatedTable = await updateTable(table.id, {
        is_active: !table.is_active,
      })

      setTables((current) =>
        current.map((item) =>
          item.id === updatedTable.id ? updatedTable : item
        )
      )

      setSuccess(
        updatedTable.is_active
          ? 'Mesa activada correctamente.'
          : 'Mesa desactivada correctamente.'
      )
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'No se pudo cambiar el estado de la mesa'
      )
    }
  }

  return (
    <section className="tables-page">
      <div className="tables-header">
        <div>
          <h2>Mesas</h2>
          <p>Administra las mesas disponibles en el restaurante.</p>
        </div>
      </div>

      {error && (
        <div className="tables-message tables-message-error">
          {error}
        </div>
      )}

      {success && (
        <div className="tables-message tables-message-success">
          {success}
        </div>
      )}

      <div className="tables-content">
        <div className="tables-form-card">
          <h3>{editingTable ? 'Editar mesa' : 'Nueva mesa'}</h3>

          <form onSubmit={handleSubmit}>
            <div className="tables-form-group">
              <label htmlFor="name">Nombre</label>

              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Mesa 1"
                maxLength={50}
                required
              />
            </div>

            <label className="tables-checkbox">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) =>
                  setFormData((current) => ({
                    ...current,
                    is_active: e.target.checked,
                  }))
                }
              />
              Mesa activa
            </label>

            <div className="tables-form-actions">
              <button type="submit" disabled={saving}>
                {saving
                  ? 'Guardando...'
                  : editingTable
                    ? 'Actualizar mesa'
                    : 'Crear mesa'}
              </button>

              {editingTable && (
                <button
                  type="button"
                  className="tables-button-secondary"
                  onClick={resetForm}
                  disabled={saving}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="tables-list-card">
          <div className="tables-list-header">
            <h3>Mesas registradas</h3>
            <span>{tables.length} mesas</span>
          </div>

          {loading ? (
            <p className="tables-empty">Cargando mesas...</p>
          ) : tables.length === 0 ? (
            <p className="tables-empty">
              No hay mesas registradas.
            </p>
          ) : (
            <div className="tables-grid">
              {tables.map((table) => (
                <article
                  className={
                    table.is_active
                      ? 'table-card'
                      : 'table-card table-card-inactive'
                  }
                  key={table.id}
                >
                  <div className="table-card-info">
                    <h4>{table.name}</h4>

                    <span
                      className={
                        table.is_active
                          ? 'tables-status tables-status-active'
                          : 'tables-status tables-status-inactive'
                      }
                    >
                      {table.is_active ? 'Activa' : 'Inactiva'}
                    </span>
                  </div>

                  <div className="table-card-actions">
                    <button
                      type="button"
                      onClick={() => handleEdit(table)}
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      className={
                        table.is_active
                          ? 'tables-button-danger'
                          : 'tables-button-success'
                      }
                      onClick={() => handleToggleActive(table)}
                    >
                      {table.is_active ? 'Desactivar' : 'Activar'}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Tables
