// 集成 Supabase

import supabase from '@/utils/supabase'
import { Product } from '@/types/supabase'

// 用户菜单权限
export const reqGetUserPermission = async (userId: number): Promise<string[]> => {
  const { data: role_data, error: role_error } = await supabase
    .from('role_permissions')
    .select('*')
    .eq('role_id', userId)
  if (role_error) {
    return []
  }
  // 菜单权限列表
  const permissionList = role_data.map(item => item.permission_code)
  return permissionList as string[]
}

// 商品列表
export const reqGetProductList = async (): Promise<Product[]> => {
  const { data, error } = await supabase.from('products').select('*')
  if (error) {
    return []
  }
  // 查对应分类
  const productList = await Promise.all(
    data.map(async item => {
      const { data: category_data, error: category_error } = await supabase
        .from('product_categories')
        .select('*')
        .eq('id', item.category_id)
        .single()
      if (category_error) {
        return item
      }
      return {
        ...item,
        category_name: category_data.category_name
      }
    })
  )
  return productList as Product[]
}
