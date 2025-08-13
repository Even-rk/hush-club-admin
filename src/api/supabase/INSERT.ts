import { Member, Product, ProductCategory } from '@/types/supabase'
import supabase from '@/utils/supabase'

// 添加商品
export const reqAddProduct = async (product: Omit<Product, 'image_path' | 'image_url'>) => {
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

// 添加分类
export const reqAddCategory = async (category: Omit<ProductCategory, 'product_count'>) => {
  const { data, error } = await supabase.from('product_categories').insert(category)
  if (error) {
    throw error
  }
  return data
}

// 添加会员
type NoHave = 'id' | 'member_code' | 'level_name' | 'created_at' | 'updated_at' | 'order_count'
export const reqAddMember = async (member: Omit<Member, NoHave>) => {
  const { data, error } = await supabase.from('members').insert(member)
  if (error) {
    throw error
  }
  return data
}
