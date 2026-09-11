import { useEffect, useState } from 'react'
import {
  getOrders,
  getProducts,
  createOrder,
  updateOrder,
  deleteOrder,
} from '../services/api'
import type { Order } from '../types/order'
import type { Product } from '../types/product'
import './Orders.css'

function Orders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [showForm, setShowForm] = useState(false)
  const [editingOrderId, setEditingOrderId] = useState<number | null>(null)

  const [formData, setFormData] = useState({
    product_id: '',
    customer_name: '',
    quantity: '1',
    status: 'pending',
  })

  useEffect(() => {
    Promise.all([getOrders(), getProducts()])
      .then(([ordersData, productsData]) => {
        setOrders(ordersData)
        setProducts(productsData)
      })
      .catch(() => {
        setError('No se pudieron cargar los pedidos.')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const resetForm = () => {
    setFormData({
      product_id: '',
      customer_name: '',
      quantity: '1',
      status: 'pending',
    })

    setEditingOrderId(null)
    setShowForm(false)
  }

  const handleSaveOrder = async () => {
    if (!formData.product_id || !formData.customer_name) {
      setError('Completa todos los campos obligatorios.')
      return
    }

    try {
      if (editingOrderId !== null) {
        const updatedOrder = await updateOrder(
          editingOrderId,
          {
            product_id: Number(formData.product_id),
            customer_name: formData.customer_name,
            quantity: Number(formData.quantity),
            status: formData.status,
          }
        )

        setOrders(
          orders.map((order) =>
            order.id === editingOrderId
              ? updatedOrder
              : order
          )
        )
      } else {
        const newOrder = await createOrder({
          product_id: Number(formData.product_id),
          customer_name: formData.customer_name,
          quantity: Number(formData.quantity),
        })

        setOrders([...orders, newOrder])
      }

      setError('')
      resetForm()
    } catch (error) {
      setError(
        editingOrderId !== null
          ? 'No se pudo actualizar el pedido.'
          : 'No se pudo crear el pedido.'
      )
    }
  }

  const handleDeleteOrder = async (order: Order) => {
    const confirmed = window.confirm(
      `¿Estás seguro de eliminar el pedido #${order.id}?`
    )

    if (!confirmed) {
      return
    }

    try {
      await deleteOrder(order.id)

      setOrders(
        orders.filter((item) => item.id !== order.id)
      )
    } catch (error) {
      setError('No se pudo eliminar el pedido.')
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendiente'
      case 'confirmed':
        return 'Confirmado'
      case 'completed':
        return 'Completado'
      case 'cancelled':
        return 'Cancelado'
      default:
        return status
    }
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'confirmed'
      case 'completed':
        return 'completed'
      case 'cancelled':
        return 'cancelled'
      default:
        return 'pending'
    }
  }

  return (
    <section className="page orders">
      <div className="page-header orders-header">
        <div>
          <span className="page-label orders-label">
            GESTIÓN DE PEDIDOS
          </span>

          <h1>Pedidos</h1>

          <p>
            Administra los pedidos registrados en el restaurante.
          </p>
        </div>

        <button
          className="btn-primary"
          onClick={() => {
            resetForm()
            setShowForm(true)
          }}
        >
          + Nuevo pedido
        </button>
      </div>

      {showForm && (
        <div className="page-form order-form">
          <h2>
            {editingOrderId !== null
              ? 'Editar pedido'
              : 'Nuevo pedido'}
          </h2>

          <div className="form-group">
            <label>Producto</label>

            <select
              value={formData.product_id}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  product_id: e.target.value,
                })
              }
            >
              <option value="">
                Selecciona un producto
              </option>

              {products.map((product) => (
                <option
                  key={product.id}
                  value={product.id}
                >
                  {product.name} - Bs. {product.price}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Cliente</label>

            <input
              type="text"
              placeholder="Nombre del cliente"
              value={formData.customer_name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  customer_name: e.target.value,
                })
              }
            />
          </div>

          <div className="form-group">
            <label>Cantidad</label>

            <input
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  quantity: e.target.value,
                })
              }
            />
          </div>

          {editingOrderId !== null && (
            <div className="form-group">
              <label>Estado</label>

              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value,
                  })
                }
              >
                <option value="pending">
                  Pendiente
                </option>

                <option value="confirmed">
                  Confirmado
                </option>

                <option value="completed">
                  Completado
                </option>

                <option value="cancelled">
                  Cancelado
                </option>
              </select>
            </div>
          )}

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
              onClick={handleSaveOrder}
            >
              {editingOrderId !== null
                ? 'Actualizar pedido'
                : 'Guardar pedido'}
            </button>
          </div>
        </div>
      )}

      {loading && <p>Cargando pedidos...</p>}

      {error && <p className="error-message">{error}</p>}

      {!loading && !error && (
        <div className="table-container orders-table-container">
          <table className="table orders-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio unitario</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>

                  <td>
                    <strong>
                      {order.customer_name}
                    </strong>
                  </td>

                  <td>
                    {order.product?.name || 'Sin producto'}
                  </td>

                  <td>{order.quantity}</td>

                  <td>
                    Bs. {order.unit_price}
                  </td>

                  <td>
                    <strong>
                      Bs. {order.total}
                    </strong>
                  </td>

                  <td>
                    <span
                      className={`status ${getStatusClass(
                        order.status
                      )}`}
                    >
                      {getStatusLabel(order.status)}
                    </span>
                  </td>

                  <td className="table-actions order-actions">
                    <button
                      className="btn-edit"
                      onClick={() => {
                        setEditingOrderId(order.id)
                        setShowForm(true)

                        setFormData({
                          product_id: String(
                            order.product_id
                          ),
                          customer_name:
                            order.customer_name,
                          quantity: String(
                            order.quantity
                          ),
                          status: order.status,
                        })
                      }}
                    >
                      Editar
                    </button>

                    <button
                      className="btn-delete"
                      onClick={() =>
                        handleDeleteOrder(order)
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

export default Orders