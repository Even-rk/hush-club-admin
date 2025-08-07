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
  Coupon,
  DatabaseMemoryUsage,
  DataOverview,
  OrderStatistics,
  Recharge
} from '@/types/supabase'
import { getPublicUrl } from '@/utils/storage'
import { formatDate } from '@/utils/format'

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
export const reqGetProductList = async (params?: {
  status?: string
  category_id?: number
  search?: string
}): Promise<Product[]> => {
  const supabaseProduct = supabase.from('products').select('*')
  // 查状态
  if (params?.status) {
    supabaseProduct.eq('status', params.status)
  }
  // 查分类
  if (params?.category_id) {
    supabaseProduct.eq('category_id', params.category_id)
  }
  // 查商品名称
  if (params?.search) {
    supabaseProduct.ilike('product_name', `%${params.search}%`)
  }
  const { data, error } = await supabaseProduct
  if (error) {
    return []
  }
  // 查对应分类
  const productList = await Promise.all(
    data.map(async (item: Product) => {
      // 查会员等级
      const [{ data: category_data }, { data: member_level_data }] = await Promise.all([
        // 查分类
        await supabase
          .from('product_categories')
          .select('category_name')
          .eq('id', item.category_id)
          .single(),
        // 查会员价格
        await supabase.from('member_levels').select('discount_rate,level_code')
      ])

      // 银牌会员折扣
      const silver_member_price =
        member_level_data?.find(i => {
          return i.level_code == 'silver'
        })?.discount_rate * item.normal_member_price
      // 金牌会员折扣
      const gold_member_price =
        member_level_data?.find(i => {
          return i.level_code == 'gold'
        })?.discount_rate * item.normal_member_price

      if (item.image_id) {
        const { data: image_data, error: image_error } = await supabase
          .from('storage_files')
          .select('file_path, bucket_name')
          .eq('id', item.image_id)
          .single()
        if (image_error) {
          return item
        }
        // 查图片地址
        const image_url = getPublicUrl(image_data.bucket_name, image_data.file_path)
        return {
          ...item,
          image_url: image_url,
          image_path: image_data.file_path,
          category_name: category_data.category_name,
          silver_member_price: silver_member_price.toFixed(2), // 保留两位小数点
          gold_member_price: gold_member_price.toFixed(2)
        }
      }

      return {
        ...item,
        category_name: category_data.category_name,
        silver_member_price: silver_member_price.toFixed(2), // 保留两位小数点
        gold_member_price: gold_member_price.toFixed(2)
      }
    })
  )
  return productList as Product[]
}

// 查商品分类
export const reqGetProductCategory = async (): Promise<ProductCategory[]> => {
  const { data, error } = await supabase
    .from('product_categories')
    .select('*')
    .eq('status', 'active')
  if (error) {
    return []
  }
  return data as ProductCategory[]
}

// 查全部分类
export const reqGetAllCategory = async (params?: {
  status?: string
  search?: string
}): Promise<ProductCategory[]> => {
  const supabaseCategory = supabase.from('product_categories').select('*')
  // 查状态
  if (params?.status) {
    supabaseCategory.eq('status', params.status)
  }
  // 查分类名称
  if (params?.search) {
    supabaseCategory.ilike('category_name', `%${params.search}%`)
  }
  const { data, error } = await supabaseCategory
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
export const reqGetAllOrder = async (params?: {
  // 最近订单
  is_recent?: boolean
  // 订单状态
  status?: string
  // 订单编号/会员手机号/会员姓名
  query?: string
  // 日期
  date?: string
  // 支付方式
  payment?: string
}): Promise<OrderDetail[]> => {
  const supabaseOrder = supabase.from('orders').select('*')
  // 查日期
  if (params?.is_recent) {
    // 查日期 7天前 到现在
    const date = new Date(new Date().setDate(new Date().getDate() - 7))
    supabaseOrder.gte('created_at', formatDate(date, 'YYYY-MM-DD'))
  }
  // 查状态
  if (params?.status) {
    supabaseOrder.eq('status', params.status)
  }
  // 查日期
  if (params?.date) {
    supabaseOrder.gte('created_at', params.date)
  }
  // 查支付方式
  if (params?.payment) {
    supabaseOrder.eq('payment_method', params.payment)
  }
  const { data: orders, error: orders_error } = await supabaseOrder
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

  // 查订单编号/会员手机号/会员姓名
  if (params?.query) {
    // 查订单编号/会员手机号/会员姓名
    return orderDetails.filter(item => {
      // 订单编号
      const order_no = item.order_no.includes(params.query)
      // 会员手机号
      const member_phone = item.member?.phone.includes(params.query)
      // 会员姓名
      const member_name = item.member?.real_name.includes(params.query)
      // 返回过滤后的订单
      return order_no || member_phone || member_name
    })
  }

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
export const reqGetMemberList = async (params?: {
  // 会员等级
  level?: string
  // 注册日期
  date?: string
  // 会员姓名/手机号/会员号
  query?: string
}): Promise<{
  maxRecharge?: number
  totalRecharge?: number
  memberTotal?: number
  memberList?: Member[]
}> => {
  const supabaseMember = supabase.from('members').select('*')
  // 查会员等级
  if (params?.level) {
    supabaseMember.eq('level_id', params.level)
  }
  // 查注册日期
  if (params?.date) {
    supabaseMember.gte('created_at', formatDate(params.date, 'YYYY-MM-DD'))
  }
  // 查会员姓名/手机号
  if (params?.query) {
    supabaseMember.or(`real_name.ilike.%${params.query}%,phone.ilike.%${params.query}%`)
  }
  const { data, error } = await supabaseMember
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

// 会员等级列表
export const reqGetMemberLevels = async (): Promise<MemberLevel[]> => {
  const { data, error } = await supabase.from('member_levels').select('*')
  if (error) {
    return []
  }
  return data as MemberLevel[]
}

// 用户列表
export const reqGetUserList = async (params?: {
  // 角色
  role?: number
  // 状态
  status?: string
  // 用户名/手机号/邮箱
  query?: string
}): Promise<User[]> => {
  const supabaseUser = supabase.from('system_users').select('*')
  // 查权限对应的用户
  if (params?.role) {
    supabaseUser.eq('role_id', params.role)
  }
  // 查状态
  if (params?.status) {
    supabaseUser.eq('status', params.status)
  }
  // 查用户名/手机号/邮箱
  if (params?.query) {
    supabaseUser.or(`username.ilike.%${params.query}%,email.ilike.%${params.query}%`)
  }
  const { data, error } = await supabaseUser
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
export const reqGetCouponList = async (params?: {
  // 状态
  status?: string
  // 类型
  type?: string
}): Promise<{
  couponList?: Coupon[]
  coupon_count?: number
  active_count?: number
  inactive_count?: number
  send_count?: number
}> => {
  const supabaseCoupon = supabase.from('coupon_templates').select('*')
  // 查状态
  if (params?.status) {
    supabaseCoupon.eq('status', params.status)
  }
  // 查类型
  if (params?.type) {
    supabaseCoupon.eq('coupon_type', params.type)
  }
  const { data, error } = await supabaseCoupon
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

// 查询supabase 内存使用量
export const reqGetDatabaseMemoryUsage = async (): Promise<DatabaseMemoryUsage[]> => {
  const { data } = await supabase.rpc('get_database_size')
  return data
}

// 数据概览
export const reqGetDataOverview = async (): Promise<DataOverview> => {
  // 查今日订单数量
  const { count: today_order_count, error: order_error } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', formatDate(new Date(), 'YYYY-MM-DD'))
  if (order_error) {
    return {}
  }
  // 查今日会员数量
  const { count: today_member_count, error: member_error } = await supabase
    .from('members')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', formatDate(new Date(), 'YYYY-MM-DD'))
  if (member_error) {
    return {}
  }
  // 查今日订单金额
  const { data: today_order_data, error: order_amount_error } = await supabase
    .from('orders')
    .select('final_amount')
    .gte('created_at', formatDate(new Date(), 'YYYY-MM-DD'))
  if (order_amount_error) {
    return {}
  }

  // 查昨日订单数量
  const { count: yesterday_order_count, error: yesterday_order_error } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .gte(
      'created_at',
      formatDate(new Date(new Date().setDate(new Date().getDate() - 1)), 'YYYY-MM-DD')
    )
  if (yesterday_order_error) {
    return {}
  }
  // 查昨日会员数量
  const { count: yesterday_member_count, error: yesterday_member_error } = await supabase
    .from('members')
    .select('*', { count: 'exact', head: true })
    .gte(
      'created_at',
      formatDate(new Date(new Date().setDate(new Date().getDate() - 1)), 'YYYY-MM-DD')
    )
  if (yesterday_member_error) {
    return {}
  }
  // 查今日订单金额
  const { data: yesterday_order_data, error: yesterday_order_amount_error } = await supabase
    .from('orders')
    .select('final_amount')
    .gte('created_at', formatDate(new Date(), 'YYYY-MM-DD'))
  if (yesterday_order_amount_error) {
    return {}
  }

  // 今日销售额
  const today_order_amount = today_order_data?.reduce((acc, item) => {
    return acc + item.final_amount
  }, 0)

  // 昨日销售额
  const yesterday_order_amount = yesterday_order_data?.reduce((acc, item) => {
    return acc + item.final_amount
  }, 0)

  return {
    // 今日订单数量
    today_order_count: today_order_count || 0,
    // 今日会员数量
    today_member_count: today_member_count || 0,
    // 今日订单金额
    today_order_amount: today_order_amount || 0,
    // 今日客单价格
    today_order_price: today_order_amount / (today_order_count || 1) || 0,
    // 昨日订单金额
    yesterday_order_amount: yesterday_order_amount || 0,
    // 昨日订单数量
    yesterday_order_count: yesterday_order_count || 0,
    // 昨日会员数量
    yesterday_member_count: yesterday_member_count || 0,
    // 昨日客单价格
    yesterday_order_price: yesterday_order_amount / (yesterday_order_count || 1) || 0
  }
}

// 查今日销量的前4名商品
export const reqGetHotProduct = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('status', 'active')
    .order('sales_count', { ascending: false })
    .limit(4)

  if (error) {
    return []
  }
  return data as Product[]
}

// 订单统计
export const reqGetOrderStatistics = async (params?: {
  // 开始时间
  startTime?: string
  // 结束时间
  endTime?: string
}): Promise<OrderStatistics> => {
  // 查订单
  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('final_amount, payment_method')
    .gte('created_at', params?.startTime)
    .lte('created_at', params?.endTime)
  if (ordersError) {
    return {}
  }
  // 查会员
  const { data: members, error: membersError } = await supabase
    .from('members')
    .select('total_recharge, balance')
    .gte('created_at', params?.startTime)
    .lte('created_at', params?.endTime)
  if (membersError) {
    return {}
  }

  // 余额支付订单
  const balance_orders = orders.filter(item => item.payment_method == 'balance')

  return {
    // 订单总数
    total_count: orders.length,
    // 营业额
    total_amount: orders.reduce((acc, item) => acc + item.final_amount, 0),
    // 客单价
    // order_price: orders.reduce((acc, item) => acc + item.final_amount, 0) / orders.length,
    // 微信支付订单数量
    wechat_count: orders.filter(item => item.payment_method == 'wechat').length,
    // 余额支付订单数量
    balance_count: balance_orders.length,
    // 余额总花费
    balance_amount: balance_orders.reduce((acc, item) => acc + item.final_amount, 0),
    // 新增会员数量
    new_member_count: members.length || 0
  }
}

// 查询储值
export const reqGetRecharge = async (): Promise<Recharge> => {
  const { data, error } = await supabase.from('members').select('total_recharge, balance')
  if (error) {
    return {}
  }

  return {
    // 总储值金额
    total_recharge: data.reduce((acc, item) => acc + item.total_recharge, 0),
    // 剩余储值金额
    remaining_balance: data.reduce((acc, item) => acc + item.balance, 0)
  }
}
