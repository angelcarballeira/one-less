export interface Product {
  id: string
  user_id: string
  name: string
  brand: string | null
  category: string
  expected_uses: number
  start_date: string
  end_date: string | null
  is_finished: boolean
  created_at: string
}

export interface CreateProductData {
  name: string
  brand?: string
  category: string
  expected_uses: number
}