import { Member, Product, ProductCategory } from '@/types/supabase'
import supabase from '@/utils/supabase'

// 更新商品
export const updateProduct = async (params: {
  id: number
  data: Omit<Product, 'image_path' | 'image_url'>
}) => {
  const { data, error } = await supabase.from('products').update(params.data).eq('id', params.id)
  if (error) {
    throw error
  }
  return data
}

// 更新商品状态
export const updateProductStatus = async (id: number, status: string) => {
  const { data, error } = await supabase
    .from('products')
    .update({ status: status === 'active' ? 'inactive' : 'active' })
    .eq('id', id)
  if (error) {
    throw error
  }
  return data
}

// 更新商品分类
export const updateProductCategory = async (params: {
  id: number
  data: Omit<ProductCategory, 'product_count'>
}) => {
  const { data, error } = await supabase
    .from('product_categories')
    .update(params.data)
    .eq('id', params.id)
  if (error) {
    throw error
  }
  return data
}

// 更新分类状态
export const updateCategoryStatus = async (id: number, status: string) => {
  const { data, error } = await supabase
    .from('product_categories')
    .update({ status: status === 'active' ? 'inactive' : 'active' })
    .eq('id', id)
  if (error) {
    throw error
  }
  return data
}

// 更新会员信息
export const updateMemberInfo = async (params: { id: number; data: Member }) => {
  const { data, error } = await supabase.from('members').update(params.data).eq('id', params.id)
  if (error) {
    throw error
  }
  return data
}
