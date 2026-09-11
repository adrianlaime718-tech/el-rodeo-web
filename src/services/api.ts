import type { Category } from "../types/category"
import type { Order } from "../types/order"
import type { Product } from "../types/product"

const API_URL = 'http://localhost:8000/api'

function authHeaders() {
  const token = localStorage.getItem('token')

  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`,
  }
}

interface ProductsResponse {
  data: Product[]
}

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(`${API_URL}/products`, {
    headers: authHeaders(),
  })

  if (!response.ok) throw new Error('Error al obtener los productos')

  const result: ProductsResponse = await response.json()
  return result.data
}

interface CategoriesResponse {
  data: Category[]
}

export async function getCategories(): Promise<Category[]> {
  const response = await fetch(`${API_URL}/categories`, {
    headers: authHeaders(),
  })

  if (!response.ok) throw new Error('Error al obtener las categorías')

  const result: CategoriesResponse = await response.json()
  return result.data
}

interface OrdersResponse {
  data: Order[]
}

export async function getOrders(): Promise<Order[]> {
  const response = await fetch(`${API_URL}/orders`, {
    headers: authHeaders(),
  })

  if (!response.ok) throw new Error('Error al obtener los pedidos')

  const result: OrdersResponse = await response.json()
  return result.data
}

export async function createProduct(product: {
  category_id: number
  name: string
  description: string
  price: number
  is_available: boolean
}): Promise<Product> {
  const response = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(product),
  })

  if (!response.ok) throw new Error('Error al crear el producto')

  const result: { data: Product } = await response.json()
  return result.data
}

export async function updateProduct(
  id: number,
  product: {
    category_id: number
    name: string
    description: string
    price: number
    is_available: boolean
  }
): Promise<Product> {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(product),
  })

  if (!response.ok) throw new Error('Error al actualizar el producto')

  const result: { data: Product } = await response.json()
  return result.data
}

export async function deleteProduct(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })

  if (!response.ok) throw new Error('Error al eliminar el producto')
}

export async function createCategory(category: {
  name: string
  description: string
  is_active: boolean
}): Promise<Category> {
  const response = await fetch(`${API_URL}/categories`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(category),
  })

  if (!response.ok) throw new Error('Error al crear la categoría')

  const result: { data: Category } = await response.json()
  return result.data
}

export async function updateCategory(
  id: number,
  category: {
    name: string
    description: string
    is_active: boolean
  }
): Promise<Category> {
  const response = await fetch(`${API_URL}/categories/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(category),
  })

  if (!response.ok) throw new Error('Error al actualizar la categoría')

  const result: { data: Category } = await response.json()
  return result.data
}

export async function deleteCategory(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/categories/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })

  if (!response.ok) throw new Error('Error al eliminar la categoría')
}

export async function createOrder(order: {
  product_id: number
  customer_name: string
  quantity: number
}): Promise<Order> {
  const response = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(order),
  })

  if (!response.ok) throw new Error('Error al crear el pedido')

  const result: { data: Order } = await response.json()
  return result.data
}

export async function updateOrder(
  id: number,
  order: {
    product_id: number
    customer_name: string
    quantity: number
    status: string
  }
): Promise<Order> {
  const response = await fetch(`${API_URL}/orders/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(order),
  })

  if (!response.ok) throw new Error('Error al actualizar el pedido')

  const result: { data: Order } = await response.json()
  return result.data
}

export async function deleteOrder(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/orders/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })

  if (!response.ok) throw new Error('Error al eliminar el pedido')
}