import { useEffect, useState } from 'react'
import {
  createUser,
  getUsers,
  updateUser,
} from '../services/api'
import type { User } from '../types/user'
import './Users.css'

type UserForm = {
  name: string
  email: string
  password: string
  role: User['role']
  is_active: boolean
}

const emptyForm: UserForm = {
  name: '',
  email: '',
  password: '',
  role: 'mesero',
  is_active: true,
}

function Users() {
  const [users, setUsers] = useState<User[]>([])
  const [formData, setFormData] = useState<UserForm>(emptyForm)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const loadUsers = async () => {
    try {
      setLoading(true)
      setError('')

      const data = await getUsers()
      setUsers(data)
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'No se pudieron cargar los usuarios'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target

    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const resetForm = () => {
    setFormData(emptyForm)
    setEditingUser(null)
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setSaving(true)
    setError('')
    setSuccess('')

    try {
      if (editingUser) {
        const data: {
          name: string
          email: string
          role: User['role']
          is_active: boolean
          password?: string
        } = {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          is_active: formData.is_active,
        }

        if (formData.password.trim()) {
          data.password = formData.password
        }

        const updatedUser = await updateUser(editingUser.id, data)

        setUsers((current) =>
          current.map((user) =>
            user.id === updatedUser.id ? updatedUser : user
          )
        )

        setSuccess('Usuario actualizado correctamente.')
      } else {
        const newUser = await createUser({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          is_active: formData.is_active,
        })

        setUsers((current) => [...current, newUser])
        setSuccess('Usuario creado correctamente.')
      }

      resetForm()
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'No se pudo guardar el usuario'
      )
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      is_active: user.is_active,
    })
    setError('')
    setSuccess('')
  }

  const handleToggleActive = async (user: User) => {
    setError('')
    setSuccess('')

    try {
      const updatedUser = await updateUser(user.id, {
        is_active: !user.is_active,
      })

      setUsers((current) =>
        current.map((item) =>
          item.id === updatedUser.id ? updatedUser : item
        )
      )

      setSuccess(
        updatedUser.is_active
          ? 'Usuario activado correctamente.'
          : 'Usuario desactivado correctamente.'
      )
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'No se pudo cambiar el estado del usuario'
      )
    }
  }

  return (
    <section className="users-page">
      <div className="users-header">
        <div>
          <h2>Usuarios</h2>
          <p>Administra los usuarios y roles del sistema.</p>
        </div>
      </div>

      {error && <div className="users-message users-message-error">{error}</div>}
      {success && (
        <div className="users-message users-message-success">{success}</div>
      )}

      <div className="users-content">
        <div className="users-form-card">
          <h3>{editingUser ? 'Editar usuario' : 'Nuevo usuario'}</h3>

          <form onSubmit={handleSubmit}>
            <div className="users-form-group">
              <label htmlFor="name">Nombre</label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                maxLength={255}
              />
            </div>

            <div className="users-form-group">
              <label htmlFor="email">Correo electrónico</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="users-form-group">
              <label htmlFor="password">
                Contraseña
                {editingUser && ' (dejar vacío para conservarla)'}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required={!editingUser}
                minLength={8}
              />
            </div>

            <div className="users-form-group">
              <label htmlFor="role">Rol</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="admin">Administrador</option>
                <option value="mesero">Mesero</option>
                <option value="cocina">Cocina</option>
              </select>
            </div>

            <label className="users-checkbox">
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
              Usuario activo
            </label>

            <div className="users-form-actions">
              <button type="submit" disabled={saving}>
                {saving
                  ? 'Guardando...'
                  : editingUser
                    ? 'Actualizar usuario'
                    : 'Crear usuario'}
              </button>

              {editingUser && (
                <button
                  type="button"
                  className="users-button-secondary"
                  onClick={resetForm}
                  disabled={saving}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="users-list-card">
          <div className="users-list-header">
            <h3>Usuarios registrados</h3>
            <span>{users.length} usuarios</span>
          </div>

          {loading ? (
            <p className="users-empty">Cargando usuarios...</p>
          ) : users.length === 0 ? (
            <p className="users-empty">No hay usuarios registrados.</p>
          ) : (
            <div className="users-table-wrapper">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Correo</th>
                    <th>Rol</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className="users-role">
                          {user.role === 'admin'
                            ? 'Administrador'
                            : user.role === 'mesero'
                              ? 'Mesero'
                              : 'Cocina'}
                        </span>
                      </td>
                      <td>
                        <span
                          className={
                            user.is_active
                              ? 'users-status users-status-active'
                              : 'users-status users-status-inactive'
                          }
                        >
                          {user.is_active ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td>
                        <div className="users-actions">
                          <button
                            type="button"
                            onClick={() => handleEdit(user)}
                          >
                            Editar
                          </button>

                          <button
                            type="button"
                            className={
                              user.is_active
                                ? 'users-button-danger'
                                : 'users-button-success'
                            }
                            onClick={() => handleToggleActive(user)}
                          >
                            {user.is_active ? 'Desactivar' : 'Activar'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Users
