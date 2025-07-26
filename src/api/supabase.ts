// 集成 Supabase

import supabase from '@/utils/supabase'
import { useErrorMessage } from 'odos-ui'

// 用户菜单权限
export const getUserPermission = async (userId: number) => {
  const { data: role_data, error: role_error } = await supabase
    .from('role_permissions')
    .select('*')
    .eq('role_id', userId)
  if (role_error) {
    useErrorMessage('获取用户信息失败')
    return null
  }
  // 菜单权限列表
  const permissionList = role_data.map(item => item.permission_code)
  return permissionList
}
