import { Product } from '@/types/supabase'
import supabase from '@/utils/supabase'

// 添加商品
export const reqAddProduct = async (product: Product) => {
  const { data, error } = await supabase.from('products').insert(product)
  if (error) {
    throw error
  }
  return data
}
