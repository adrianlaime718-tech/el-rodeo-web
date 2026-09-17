export interface OrderUser {
  id: number
  name: string
  role: string
}

export interface OrderTable {
  id: number
  name: string
  is_active: boolean
}

export interface OrderProduct {
  id: number
  name: string
  price: string
}

export interface OrderItem {
  id: number
  product: OrderProduct | null
  quantity: number
  unit_price: string
  subtotal: string
}

export interface Order {
  id: number
  user: OrderUser | null
  type: string
  table: OrderTable | null
  customer_name: string | null
  items: OrderItem[]
  total: string
  status: string
  created_at: string
  updated_at: string
}