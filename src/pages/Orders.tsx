import { useEffect, useState } from 'react'

import {
  getOrders,
  getProducts,
  getTables,
  createOrder,
  updateOrder,
  updateOrderItems,
  deleteOrder,
} from '../services/api'

import type { Order } from '../types/order'
import type { Product } from '../types/product'
import type { Table } from '../types/table'

import './Orders.css'

interface FormItem {
  product_id: string
  quantity: string
}

interface FormData {
  type: 'mesa' | 'para_llevar'
  table_id: string
  customer_name: string
  items: FormItem[]
  status: string
}

interface AuthUser {
  id: number
  name: string
  email?: string
  role: string
}

function Orders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [tables, setTables] = useState<Table[]>([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [showForm, setShowForm] = useState(false)
  const [editingOrderId, setEditingOrderId] = useState<number | null>(null)

  const [formData, setFormData] = useState<FormData>({
    type: 'mesa',
    table_id: '',
    customer_name: '',
    items: [
      {
        product_id: '',
        quantity: '1',
      },
    ],
    status: 'pending',
  })

  const storedUser = localStorage.getItem('user')

  let role = ''

  try {
    const user: AuthUser | null =
      storedUser ? JSON.parse(storedUser) : null

    role = user?.role ?? ''
  } catch {
    role = ''
  }

  const canCreate = role === 'admin' || role === 'mesero'
  const canDelete = role === 'admin'
  const canChangeStatus = role === 'admin' || role === 'cocina'

  useEffect(() => {
    const loadData = async () => {
      try {
        const [ordersData, productsData] = await Promise.all([
          getOrders(),
          getProducts(),
        ])

        setOrders(ordersData)
        setProducts(productsData)

        if (role === 'admin' || role === 'mesero') {
          const tablesData = await getTables()
          setTables(tablesData)
        }
      } catch {
        setError('No se pudieron cargar los pedidos.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [role])

  const resetForm = () => {
    setFormData({
      type: 'mesa',
      table_id: '',
      customer_name: '',
      items: [
        {
          product_id: '',
          quantity: '1',
        },
      ],
      status: 'pending',
    })

    setEditingOrderId(null)
    setShowForm(false)
  }

  const handleFormChange = (
    field: keyof FormData,
    value: string
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const handleItemChange = (
    index: number,
    field: keyof FormItem,
    value: string
  ) => {
    setFormData((current) => ({
      ...current,
      items: current.items.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item
      ),
    }))
  }

  const addItem = () => {
    setFormData((current) => ({
      ...current,
      items: [
        ...current.items,
        {
          product_id: '',
          quantity: '1',
        },
      ],
    }))
  }

  const removeItem = (index: number) => {
    setFormData((current) => {
      if (current.items.length === 1) {
        return current
      }

      return {
        ...current,
        items: current.items.filter(
          (_, itemIndex) => itemIndex !== index
        ),
      }
    })
  }

  const getFormTotal = () => {
    return formData.items.reduce((total, item) => {
      const product = products.find(
        (currentProduct) =>
          currentProduct.id === Number(item.product_id)
      )

      if (!product) {
        return total
      }

      return (
        total +
        Number(product.price) * Number(item.quantity || 0)
      )
    }, 0)
  }

  const validateItems = () => {
    if (formData.items.length === 0) {
      setError('Agrega al menos un producto.')
      return false
    }

    const invalidItem = formData.items.some(
      (item) =>
        !item.product_id ||
        Number(item.quantity) < 1
    )

    if (invalidItem) {
      setError(
        'Selecciona un producto y una cantidad válida para cada producto.'
      )
      return false
    }

    return true
  }

  const handleSaveOrder = async () => {
    setError('')

    /*
     * CREAR PEDIDO
     */
    if (editingOrderId === null) {
      if (!validateItems()) {
        return
      }

      if (
        formData.type === 'mesa' &&
        !formData.table_id
      ) {
        setError('Selecciona una mesa.')
        return
      }

      if (
        formData.type === 'para_llevar' &&
        !formData.customer_name.trim()
      ) {
        setError('Ingresa el nombre del cliente.')
        return
      }

      try {
        const newOrder = await createOrder({
          type: formData.type,
          table_id:
            formData.type === 'mesa'
              ? Number(formData.table_id)
              : null,
          customer_name:
            formData.type === 'para_llevar'
              ? formData.customer_name.trim()
              : null,
          items: formData.items.map((item) => ({
            product_id: Number(item.product_id),
            quantity: Number(item.quantity),
          })),
        })

        setOrders((current) => [
          ...current,
          newOrder,
        ])

        resetForm()
      } catch {
        setError('No se pudo crear el pedido.')
      }

      return
    }

    /*
     * EDITAR PEDIDO
     *
     * Los productos se modifican mediante:
     * PUT /orders/{id}/items
     *
     * El estado se modifica mediante:
     * PUT /orders/{id}
     *
     * No enviamos type, table_id ni customer_name
     * porque UpdateOrderRequest solamente acepta status.
     */

    try {
      if (role === 'admin' || role === 'mesero') {
        if (!validateItems()) {
          return
        }

        await updateOrderItems(
          editingOrderId,
          formData.items.map((item) => ({
            product_id: Number(item.product_id),
            quantity: Number(item.quantity),
          }))
        )
      }

      if (
        canChangeStatus &&
        formData.status !== 'pending'
      ) {
        await updateOrder(editingOrderId, {
          status: formData.status,
        })
      }

      const refreshedOrders = await getOrders()

      setOrders(refreshedOrders)
      resetForm()
    } catch {
      setError('No se pudo actualizar el pedido.')
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

      setOrders((current) =>
        current.filter(
          (item) => item.id !== order.id
        )
      )

      setError('')
    } catch {
      setError('No se pudo eliminar el pedido.')
    }
  }

  const handleEditOrder = (order: Order) => {
    const canEditItems =
      role === 'admin' || role === 'mesero'

    const canChangeThisStatus =
      (role === 'admin' || role === 'cocina') &&
      (order.status === 'pending' ||
        order.status === 'confirmed')

    if (
      order.status !== 'pending' &&
      !canChangeThisStatus
    ) {
      setError(
        'Este pedido ya no puede ser modificado.'
      )
      return
    }

    if (!canEditItems && !canChangeThisStatus) {
      setError(
        'No tienes permisos para modificar este pedido.'
      )
      return
    }

    setEditingOrderId(order.id)

    setFormData({
      type:
        order.type === 'para_llevar'
          ? 'para_llevar'
          : 'mesa',

      table_id:
        order.table?.id
          ? String(order.table.id)
          : '',

      customer_name:
        order.customer_name ?? '',

      items: order.items.map((item) => ({
        product_id: item.product
          ? String(item.product.id)
          : '',
        quantity: String(item.quantity),
      })),

      status: order.status,
    })

    setShowForm(true)
    setError('')
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

  const getOrderItemsLabel = (order: Order) => {
    if (order.items.length === 0) {
      return 'Sin productos'
    }

    return order.items
      .map((item) => {
        const productName =
          item.product?.name ?? 'Producto'

        return `${productName} x${item.quantity}`
      })
      .join(', ')
  }

  const isEditing = editingOrderId !== null

  const canEditItems =
    !isEditing ||
    (isEditing &&
      (role === 'admin' || role === 'mesero'))

  const canEditStatus =
    isEditing && canChangeStatus

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

        {canCreate && (
          <button
            className="btn-primary"
            onClick={() => {
              resetForm()
              setShowForm(true)
            }}
          >
            + Nuevo pedido
          </button>
        )}
      </div>

      {showForm && (
        <div className="page-form order-form">
          <h2>
            {isEditing
              ? 'Editar pedido'
              : 'Nuevo pedido'}
          </h2>

          {!isEditing && (
            <>
              <div className="form-group">
                <label>Tipo de pedido</label>

                <select
                  value={formData.type}
                  onChange={(event) => {
                    const type =
                      event.target.value as
                        | 'mesa'
                        | 'para_llevar'

                    setFormData((current) => ({
                      ...current,
                      type,
                      table_id:
                        type === 'mesa'
                          ? current.table_id
                          : '',
                      customer_name:
                        type === 'para_llevar'
                          ? current.customer_name
                          : '',
                    }))
                  }}
                >
                  <option value="mesa">
                    Mesa
                  </option>

                  <option value="para_llevar">
                    Para llevar
                  </option>
                </select>
              </div>

              {formData.type === 'mesa' && (
                <div className="form-group">
                  <label>Mesa</label>

                  <select
                    value={formData.table_id}
                    onChange={(event) =>
                      handleFormChange(
                        'table_id',
                        event.target.value
                      )
                    }
                  >
                    <option value="">
                      Selecciona una mesa
                    </option>

                    {tables
                      .filter(
                        (table) => table.is_active
                      )
                      .map((table) => (
                        <option
                          key={table.id}
                          value={table.id}
                        >
                          {table.name}
                        </option>
                      ))}
                  </select>
                </div>
              )}

              {formData.type === 'para_llevar' && (
                <div className="form-group">
                  <label>Cliente</label>

                  <input
                    type="text"
                    placeholder="Nombre del cliente"
                    value={formData.customer_name}
                    onChange={(event) =>
                      handleFormChange(
                        'customer_name',
                        event.target.value
                      )
                    }
                  />
                </div>
              )}
            </>
          )}

          {isEditing && !canEditItems && !canEditStatus && (
            <p>
              Este pedido no tiene campos que puedas modificar.
            </p>
          )}

          {canEditItems && (
            <div className="order-items-form">
              <div className="order-items-header">
                <h3>Productos</h3>

                <button
                  type="button"
                  className="btn-primary"
                  onClick={addItem}
                >
                  + Agregar producto
                </button>
              </div>

              {formData.items.map(
                (item, index) => (
                  <div
                    className="order-item-form"
                    key={index}
                  >
                    <div className="form-group">
                      <label>
                        Producto
                      </label>

                      <select
                        value={item.product_id}
                        onChange={(event) =>
                          handleItemChange(
                            index,
                            'product_id',
                            event.target.value
                          )
                        }
                      >
                        <option value="">
                          Selecciona un producto
                        </option>

                        {products
                          .filter(
                            (product) =>
                              product.is_available
                          )
                          .map((product) => (
                            <option
                              key={product.id}
                              value={product.id}
                            >
                              {product.name} - Bs.{' '}
                              {product.price}
                            </option>
                          ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>
                        Cantidad
                      </label>

                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(event) =>
                          handleItemChange(
                            index,
                            'quantity',
                            event.target.value
                          )
                        }
                      />
                    </div>

                    {formData.items.length > 1 && (
                      <button
                        type="button"
                        className="btn-delete"
                        onClick={() =>
                          removeItem(index)
                        }
                      >
                        Quitar
                      </button>
                    )}
                  </div>
                )
              )}

              <div className="order-form-total">
                <strong>
                  Total estimado: Bs.{' '}
                  {getFormTotal().toFixed(2)}
                </strong>
              </div>
            </div>
          )}

          {canEditStatus && (
            <div className="form-group">
              <label>Estado</label>

              <select
                value={formData.status}
                onChange={(event) =>
                  handleFormChange(
                    'status',
                    event.target.value
                  )
                }
              >
                {formData.status === 'pending' && (
                  <>
                    <option value="pending">
                      Pendiente
                    </option>

                    <option value="confirmed">
                      Confirmado
                    </option>

                    <option value="cancelled">
                      Cancelado
                    </option>
                  </>
                )}

                {formData.status === 'confirmed' && (
                  <>
                    <option value="confirmed">
                      Confirmado
                    </option>

                    <option value="completed">
                      Completado
                    </option>

                    <option value="cancelled">
                      Cancelado
                    </option>
                  </>
                )}
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
              {isEditing
                ? 'Actualizar pedido'
                : 'Guardar pedido'}
            </button>
          </div>
        </div>
      )}

      {loading && (
        <p>Cargando pedidos...</p>
      )}

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

      {!loading && !error && (
        <div className="table-container orders-table-container">
          <table className="table orders-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tipo</th>
                <th>Mesa / Cliente</th>
                <th>Productos</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Usuario</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>

                  <td>
                    {order.type === 'mesa'
                      ? 'Mesa'
                      : 'Para llevar'}
                  </td>

                  <td>
                    <strong>
                      {order.type === 'mesa'
                        ? order.table?.name ??
                          'Sin mesa'
                        : order.customer_name ??
                          'Sin cliente'}
                    </strong>
                  </td>

                  <td>
                    {getOrderItemsLabel(order)}
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
                      {getStatusLabel(
                        order.status
                      )}
                    </span>
                  </td>

                  <td>
                    {order.user?.name ??
                      'Sin usuario'}
                  </td>

                  <td className="table-actions order-actions">
                    {order.status ===
                      'pending' &&
                      (role === 'admin' ||
                        role === 'mesero') && (
                        <button
                          className="btn-edit"
                          onClick={() =>
                            handleEditOrder(order)
                          }
                        >
                          Editar
                        </button>
                      )}

                    {canChangeStatus &&
                      (order.status === 'pending' ||
                        order.status === 'confirmed') && (
                        <button
                          className="btn-edit"
                          onClick={() =>
                            handleEditOrder(order)
                          }
                        >
                          Cambiar estado
                        </button>
                      )}

                    {canDelete && (
                      <button
                        className="btn-delete"
                        onClick={() =>
                          handleDeleteOrder(
                            order
                          )
                        }
                      >
                        Eliminar
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              {orders.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    style={{
                      textAlign: 'center',
                    }}
                  >
                    No hay pedidos registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default Orders
