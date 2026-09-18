export interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'mesero' | 'cocina'
  is_active: boolean
}
