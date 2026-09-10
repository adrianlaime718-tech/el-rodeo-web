export interface Product {
  id: number
  category_id: number
  name: string
  description: string | null
  price: string
  is_available: boolean
  category: {
    id: number
    name: string
  }
}