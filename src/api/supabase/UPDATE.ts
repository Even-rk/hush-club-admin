import { Product } from '@/types/supabase'
import supabase from '@/utils/supabase'

// 更新商品
export const updateProduct = async (params: { id: number; data: Product }) => {
  const { data, error } = await supabase.from('products').update(params.data).eq('id', params.id)
  if (error) {
    throw error
  }
  return data
}
