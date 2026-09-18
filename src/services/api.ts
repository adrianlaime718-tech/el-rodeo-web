import type { Category } from '../types/category'
import type { Order } from '../types/order'
import type { Product } from '../types/product'
import type { Table } from '../types/table'
import type { User } from '../types/user'

const API_URL = 'http://localhost:8000/api'

function authHeaders(): HeadersInit {
  const token = localStorage.getItem('token')

  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  }
}

interface ProductsResponse {
  data: Product[]
}

interface CategoriesResponse {
  data: Category[]
}

interface OrdersResponse {
  data: Order[]
}

interface TablesResponse {
  data: Table[]
}

interface UsersResponse {
  data: User[]
}

// ====================
// PRODUCTOS
// ====================

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(`${API_URL}/products`, {
    headers: authHeaders(),
  })

  if (!response.ok) {
    throw new Error('Error al obtener los productos')
  }

  const result: ProductsResponse = await response.json()
  return result.data
}

export async function createProduct(
  product: {
    name: string
    description?: string
    price: number
    category_id: number
    is_available?: boolean
  }
): Promise<Product> {
  const response = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(product),
  })

  if (!response.ok) {
    throw new Error('Error al crear el producto')
  }

  const result = await response.json()
  return result.data
}

export async function updateProduct(
  id: number,
  product: {
    name?: string
    description?: string
    price?: number
    category_id?: number
    is_available?: boolean
  }
): Promise<Product> {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(product),
  })

  if (!response.ok) {
    throw new Error('Error al actualizar el producto')
  }

  const result = await response.json()
  return result.data
}

export async function deleteProduct(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })

  if (!response.ok) {
    throw new Error('Error al eliminar el producto')
  }
}

// ====================
// CATEGORÍAS
// ====================

export async function getCategories(): Promise<Category[]> {
  const response = await fetch(`${API_URL}/categories`, {
    headers: authHeaders(),
  })

  if (!response.ok) {
    throw new Error('Error al obtener las categorías')
  }

  const result: CategoriesResponse = await response.json()
  return result.data
}

export async function createCategory(
  category: Omit<Category, 'id'>
): Promise<Category> {
  const response = await fetch(`${API_URL}/categories`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(category),
  })

  if (!response.ok) {
    throw new Error('Error al crear la categoría')
  }

  const result = await response.json()
  return result.data
}

export async function updateCategory(
  id: number,
  category: Partial<Omit<Category, 'id'>>
): Promise<Category> {
  const response = await fetch(`${API_URL}/categories/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(category),
  })

  if (!response.ok) {
    throw new Error('Error al actualizar la categoría')
  }

  const result = await response.json()
  return result.data
}

export async function deleteCategory(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/categories/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })

  if (!response.ok) {
    throw new Error('Error al eliminar la categoría')
  }
}

// ====================
// MESAS
// ====================

export async function getTables(): Promise<Table[]> {
  const response = await fetch(`${API_URL}/tables`, {
    headers: authHeaders(),
  })

  if (!response.ok) {
    throw new Error('Error al obtener las mesas')
  }

  const result: TablesResponse = await response.json()
  return result.data
}

export async function createTable(
  table: Pick<Table, 'name'> & Partial<Pick<Table, 'is_active'>>
): Promise<Table> {
  const response = await fetch(`${API_URL}/tables`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(table),
  })

  if (!response.ok) {
    throw new Error('Error al crear la mesa')
  }

  const result = await response.json()
  return result.data
}

export async function updateTable(
  id: number,
  table: Partial<Pick<Table, 'name' | 'is_active'>>
): Promise<Table> {
  const response = await fetch(`${API_URL}/tables/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(table),
  })

  if (!response.ok) {
    throw new Error('Error al actualizar la mesa')
  }

  const result = await response.json()
  return result.data
}

// ====================
// USUARIOS
// ====================

export async function getUsers(): Promise<User[]> {
  const response = await fetch(`${API_URL}/users`, {
    headers: authHeaders(),
  })

  if (!response.ok) {
    throw new Error('Error al obtener los usuarios')
  }

  const result: UsersResponse = await response.json()
  return result.data
}

export async function createUser(
  user: {
    name: string
    email: string
    password: string
    role: User['role']
    is_active?: boolean
  }
): Promise<User> {
  const response = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(user),
  })

  if (!response.ok) {
    const data = await response.json().catch(() => null)
    throw new Error(data?.message || 'Error al crear el usuario')
  }

  const result = await response.json()
  return result.data
}

export async function updateUser(
  id: number,
  user: {
    name?: string
    email?: string
    password?: string
    role?: User['role']
    is_active?: boolean
  }
): Promise<User> {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(user),
  })

  if (!response.ok) {
    const data = await response.json().catch(() => null)
    throw new Error(data?.message || 'Error al actualizar el usuario')
  }

  const result = await response.json()
  return result.data
}

// ====================
// PEDIDOS
// ====================

export async function getOrders(): Promise<Order[]> {
  const response = await fetch(`${API_URL}/orders`, {
    headers: authHeaders(),
  })

  if (!response.ok) {
    throw new Error('Error al obtener los pedidos')
  }

  const result: OrdersResponse = await response.json()
  return result.data
}

export async function createOrder(order: {
  type: 'mesa' | 'para_llevar'
  table_id?: number | null
  customer_name?: string | null
  items: {
    product_id: number
    quantity: number
  }[]
}): Promise<Order> {
  const response = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(order),
  })

  if (!response.ok) {
    throw new Error('Error al crear el pedido')
  }

  const result = await response.json()
  return result.data
}

export async function updateOrder(
  id: number,
  order: {
    status?: Order['status']
  }
): Promise<Order> {
  const response = await fetch(`${API_URL}/orders/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(order),
  })

  if (!response.ok) {
    throw new Error('Error al actualizar el pedido')
  }

  const result = await response.json()
  return result.data
}

export async function updateOrderItems(
  id: number,
  items: {
    product_id: number
    quantity: number
  }[]
): Promise<Order> {
  const response = await fetch(`${API_URL}/orders/${id}/items`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({ items }),
  })

  if (!response.ok) {
    throw new Error('Error al actualizar los productos del pedido')
  }

  const result = await response.json()
  return result.data
}

export async function deleteOrder(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/orders/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })

  if (!response.ok) {
    throw new Error('Error al eliminar el pedido')
  }
}
