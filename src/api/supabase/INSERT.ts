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

// 注册用户
export const reqAddUser = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) {
    throw error
  }
  return data
}
