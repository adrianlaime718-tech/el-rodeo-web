import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css'

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    setError('')
    setLoading(true)

    try {
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Credenciales incorrectas')
      }

      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      navigate('/')
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'No se pudo iniciar sesión'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="login">
      <div className="login-card">
        <div className="login-header">
          <span>EL RODEO</span>
          <h1>Iniciar sesión</h1>
          <p>Accede al sistema de gestión</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="login-group">
            <label>Correo electrónico</label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@elrodeo.com"
              required
            />
          </div>

          <div className="login-group">
            <label>Contraseña</label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <p className="login-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Ingresando...' : 'Iniciar sesión'}
          </button>
        </form>
      </div>
    </section>
  )
}

export default Login