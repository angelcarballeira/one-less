import { supabase } from '../lib/supabase'
import type { ProductUse } from '../types/productUse'

export async function getProductUses(productId: string) {
  const { data, error } = await supabase
    .from('product_uses')
    .select('*')
    .eq('product_id', productId)
    .order('used_at', { ascending: false })

  if (error) {
    throw error
  }

  return data as ProductUse[]
}

export async function registerProductUse(productId: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('No hay un usuario autenticado')
  }

  const { data, error } = await supabase
    .from('product_uses')
    .insert({
      product_id: productId,
      user_id: user.id,
    })
    .select()
    .single()

  if (error) {
    throw error
  }

  return data as ProductUse
}