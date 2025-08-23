import { supabase } from './supabase'
import { formatDate } from './format'
import message from './message'

/**
 * 登录验证函数
 * @param data 登录数据
 * @returns token 字符串，失败返回 null
 */
export const SupabaseLogin = async (data: { phone: string; password: string }) => {
  const { phone, password } = data

  // 登录鉴权
  const { data: supabaseUser, error: supabaseError } = await supabase.auth.signInWithPassword({
    email: 'kwr011024@163.com',
    password: 'kwr102466'
  })
  if (supabaseError) {
    message.error('登录失败，账号或密码错误。')
    return null
  }

  // 查询用户信息
  const { data: user, error } = await supabase
    .from('system_users')
    .select('*')
    .eq('phone', phone)
    .single()

  if (error || !user) {
    message.error('登录失败，手机号不存在。')
    return null
  }

  if (user.password !== password) {
    message.error('登录失败，密码错误。')
    return null
  }

  // 更新表最后一次登录时间
  await supabase
    .from('system_users')
    .update({ last_login_time: formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss') })
    .eq('id', user.id)

  // 查用户角色
  const { data: role } = await supabase
    .from('user_roles')
    .select('role_code')
    .eq('id', user.role_id)
    .single()

  return {
    id: user.id as number,
    token: supabaseUser.session?.access_token as string,
    last_login_time: user.last_login_time as string,
    real_name: user.real_name as string,
    role_code: role?.role_code,
    username: user.username as string
  }
}
