import { useEffect, useState } from 'react'
import { getOrders } from '../services/api'
import type { Order } from '../types/order'
import './Orders.css'

function Orders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getOrders()
      .then(setOrders)
      .catch(() => {
        setError('No se pudieron cargar los pedidos.')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return (
    <section className="orders">
      <div className="orders-header">
        <div>
          <span className="orders-label">GESTIÓN DE PEDIDOS</span>

          <h1>Pedidos</h1>

          <p>
            Consulta y gestiona los pedidos realizados en el restaurante.
          </p>
        </div>
      </div>

      {loading && <p>Cargando pedidos...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && (
        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio unitario</th>
                <th>Total</th>
                <th>Estado</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>

                  <td>
                    <strong>{order.customer_name}</strong>
                  </td>

                  <td>{order.product.name}</td>

                  <td>{order.quantity}</td>

                  <td>
                    Bs. {Number(order.unit_price).toFixed(2)}
                  </td>

                  <td>
                    <strong>
                      Bs. {Number(order.total).toFixed(2)}
                    </strong>
                  </td>

                  <td>
                    <span className={`status ${order.status}`}>
                      {order.status}
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

export default Orders