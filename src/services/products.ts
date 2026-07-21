import { supabase } from '../lib/supabase'
import type { CreateProductData, Product } from '../types/product'

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return data as Product[]
}

export async function createProduct(product: CreateProductData) {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  const { data, error } = await supabase
    .from('products')
    .insert({
      user_id: user.id,
      name: product.name,
      brand: product.brand || null,
      category: product.category,
      expected_uses: product.expected_uses,
    })
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}