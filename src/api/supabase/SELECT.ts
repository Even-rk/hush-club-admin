// 集成 Supabase

import supabase from '@/utils/supabase'
import {
  Product,
  ProductCategory,
  OrderDetail,
  Member,
  MemberLevel,
  UpdateMember,
  User,
  RolePermission,
  Coupon
} from '@/types/supabase'
import { getPublicUrl } from '@/utils/storage'

// 用户菜单权限
export const reqGetUserPermission = async (userId: number): Promise<string[]> => {
  const { data: role_data, error: role_error } = await supabase
    .from('role_permissions')
    .select('permission_code')
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
      // 查分类
      const { data: category_data, error: category_error } = await supabase
        .from('product_categories')
        .select('category_name')
        .eq('id', item.category_id)
        .single()
      if (category_error) {
        return item
      }
      // 查图片
      if (item.image_id) {
        const { data: image_data, error: image_error } = await supabase
          .from('storage_files')
          .select('file_path, bucket_name')
          .eq('id', item.image_id)
          .single()
        if (image_error) {
          return {
            ...item,
            category_name: category_data.category_name
          }
        }
        // 查图片地址
        const image_url = getPublicUrl(image_data.bucket_name, image_data.file_path)
        return {
          ...item,
          category_name: category_data.category_name,
          image_url: image_url
        }
      }
      return {
        ...item,
        category_name: category_data.category_name
      }
    })
  )
  return productList as Product[]
}

// 查全部分类
export const reqGetAllCategory = async (): Promise<ProductCategory[]> => {
  const { data, error } = await supabase
    .from('product_categories')
    .select('*')
    .order('sort_order', { ascending: true })
  if (error) {
    return []
  }
  // 关联商品数量
  const categoryList = await Promise.all(
    data.map(async item => {
      const { count: product_data, error: product_error } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', item.id)
      if (product_error) {
        return item
      }
      return {
        ...item,
        product_count: product_data
      }
    })
  )
  return categoryList as ProductCategory[]
}

// 查全部订单（包含会员信息和商品明细）
export const reqGetAllOrder = async (): Promise<OrderDetail[]> => {
  const { data: orders, error: orders_error } = await supabase.from('orders').select('*')
  if (orders_error) {
    return []
  }

  // 获取所有订单的完整信息
  const orderDetails = await Promise.all(
    orders.map(async order => {
      // 查询会员信息
      const { data: member, error: member_error } = await supabase
        .from('members')
        .select('*')
        .eq('id', order.member_id)
        .single()

      // 查询订单商品明细
      const { data: order_items, error: items_error } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', order.id)

      return {
        ...order,
        member: member_error ? null : member,
        order_items: items_error ? [] : order_items
      }
    })
  )

  return orderDetails as OrderDetail[]
}

// 查会员等级列表
export const reqGetMemberLevelList = async (): Promise<{
  memberLevels?: MemberLevel[]
  updateMembers?: UpdateMember[]
}> => {
  const { data, error } = await supabase.from('member_levels').select('*')
  if (error) {
    return {}
  }

  // 查询会员数量
  const memberLevelList = await Promise.all(
    data.map(async i => {
      const { count: member_count, error: member_count_error } = await supabase
        .from('members')
        .select('*', { count: 'exact', head: true })
        .eq('level_id', i.id)
      if (member_count_error) {
        return {
          ...i,
          member_count: 0
        }
      }
      return {
        ...i,
        member_count: member_count || 0
      }
    })
  )

  // 最近升级会员
  const { data: members_upgrade_records, error: members_upgrade_records_error } = await supabase
    .from('membership_upgrade_records')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)
  if (members_upgrade_records_error) {
    return {}
  }

  // 查会员等级
  const members_List = await Promise.all(
    members_upgrade_records.map(async item => {
      // 查会员
      const { data: member, error: member_error } = await supabase
        .from('members')
        .select('real_name,phone,level_id')
        .eq('id', item.member_id)
        .single()
      if (member_error) {
        return item
      }
      // 查原会员等级
      const { data: member_level, error: member_level_error } = await supabase
        .from('member_levels')
        .select('level_name')
        .eq('id', item.original_level_id)
        .single()
      if (member_level_error) {
        return {
          ...item,
          // 会员姓名
          real_name: member?.real_name,
          // 手机号
          phone: member?.phone
        }
      }
      // 查新会员等级
      const { data: new_member_level, error: new_member_level_error } = await supabase
        .from('member_levels')
        .select('level_name')
        .eq('id', member.level_id)
        .single()
      if (new_member_level_error) {
        return {
          ...item,
          // 会员姓名
          real_name: member?.real_name,
          // 手机号
          phone: member?.phone
        }
      }
      return {
        ...item,
        // 会员姓名
        real_name: member?.real_name,
        // 手机号
        phone: member?.phone,
        // 原会员等级名称
        original_level_name: member_level?.level_name,
        // 新会员等级名称
        new_level_name: new_member_level?.level_name
      }
    })
  )

  return {
    memberLevels: memberLevelList as MemberLevel[],
    updateMembers: members_List
  }
}

// 查会员列表
export const reqGetMemberList = async (): Promise<{
  maxRecharge?: number
  totalRecharge?: number
  memberTotal?: number
  memberList?: Member[]
}> => {
  const { data, error } = await supabase.from('members').select('*')
  if (error) {
    return {}
  }

  // 查会员等级
  const memberList = await Promise.all(
    data.map(async item => {
      const { data: member_level, error: member_level_error } = await supabase
        .from('member_levels')
        .select('level_name')
        .eq('id', item.level_id)
        .single()
      if (member_level_error) {
        return item
      }
      return {
        ...item,
        level_name: member_level?.level_name
      }
    })
  )

  return {
    // 单次最高充值总额
    maxRecharge: data.reduce((acc, item) => Math.max(acc, item.total_recharge), 0),
    // 总充值金额
    totalRecharge: data.reduce((acc, item) => acc + item.total_recharge, 0),
    // 会员数量
    memberTotal: data.length,
    // 会员列表
    memberList: memberList as Member[]
  }
}

// 用户列表
export const reqGetUserList = async (): Promise<User[]> => {
  const { data, error } = await supabase.from('system_users').select('*')
  if (error) {
    return []
  }

  // 查角色
  const roleList = await Promise.all(
    data.map(async item => {
      const { data: role, error: role_error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('id', item.role_id)
        .single()
      if (role_error) {
        return item
      }
      return {
        ...item,
        role_name: role?.role_name
      }
    })
  )

  return roleList as User[]
}

// 角色权限列表
export const reqGetRolePermissionList = async (): Promise<RolePermission[]> => {
  const { data: role, error: role_error } = await supabase.from('user_roles').select('*')
  if (role_error) {
    return []
  }
  // 查等级对应权限
  const rolePermissionList = await Promise.all(
    role.map(async item => {
      const { data: permission_list, error: permission_error } = await supabase
        .from('role_permissions')
        .select('permission_code, menu_name')
        .eq('role_id', item.id)
      if (permission_error) {
        return item
      }
      return {
        ...item,
        permissions: permission_list
      }
    })
  )

  return rolePermissionList as RolePermission[]
}

// 优惠券列表
export const reqGetCouponList = async (): Promise<{
  couponList?: Coupon[]
  coupon_count?: number
  active_count?: number
  inactive_count?: number
  send_count?: number
}> => {
  const { data, error } = await supabase.from('coupon_templates').select('*')
  if (error) {
    return {}
  }

  // 处理有效时间
  const couponList = data.map(item => {
    if (item.valid_days == '0' || !item.valid_days) {
      return { ...item, valid_day: '长期有效' }
    } else {
      // 创建时间加天数
      const valid_day_date = new Date(item.created_at)
      valid_day_date.setDate(valid_day_date.getDate() + parseInt(item.valid_days))
      return { ...item, valid_day: valid_day_date.toISOString() }
    }
  })

  // 优惠券模版数量
  const coupon_count = couponList.length
  // 正常状态数量
  const active_count = couponList.filter(item => item.status == 'active').length
  // 禁用状态数量
  const inactive_count = couponList.filter(item => item.status == 'inactive').length
  // 累计发送数量
  const { count: send_count, error: send_error } = await supabase
    .from('member_coupons')
    .select('*', { count: 'exact', head: true })
  if (send_error) {
    return {}
  }

  return {
    couponList: couponList as Coupon[],
    coupon_count: coupon_count || 0,
    active_count: active_count || 0,
    inactive_count: inactive_count || 0,
    send_count: send_count || 0
  }
}
