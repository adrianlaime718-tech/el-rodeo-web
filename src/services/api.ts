import type { Category } from "../types/category"
import type { Order } from "../types/order"
import type { Product } from "../types/product"

const API_URL = 'http://localhost:8000/api'

interface ProductsResponse {
  data: Product[]
}

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(`${API_URL}/products`)

  if (!response.ok) {
    throw new Error('Error al obtener los productos')
  }

  const result: ProductsResponse = await response.json()

  return result.data
}

interface CategoriesResponse {
  data: Category[]
}

export async function getCategories(): Promise<Category[]> {
  const response = await fetch(`${API_URL}/categories`)

  if (!response.ok) {
    throw new Error('Error al obtener las categorías')
  }

  const result: CategoriesResponse = await response.json()

  return result.data
}

interface OrdersResponse {
  data: Order[]
}

export async function getOrders(): Promise<Order[]> {
  const response = await fetch(`${API_URL}/orders`)

  if (!response.ok) {
    throw new Error('Error al obtener los pedidos')
  }

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
    headers: { 
      'Content-Type': 'application/json', 
      'Accept': 'application/json', 
    }, 
    body: JSON.stringify(product), 
  }) 
    
  if (!response.ok) { 
    throw new Error('Error al crear el producto') 
  } 
  
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
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(product),
  })

  if (!response.ok) {
    throw new Error('Error al actualizar el producto')
  }

  const result: { data: Product } = await response.json()

  return result.data
}


export async function deleteProduct(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Error al eliminar el producto')
  }
}