import { supabase } from './supabase'
import { formatDate } from './format'
import message from './message'

/**
 * 登录验证函数
 * @param data 登录数据
 * @returns token 字符串，失败返回 null
 */
export const SupabaseLogin = async (data: { email: string; password: string }) => {
  const { email, password } = data

  // 登录鉴权
  const { data: supabaseUser, error: supabaseError } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  if (supabaseError) {
    message.error('登录失败，账号或密码错误。')
    return null
  }

  // 查询用户信息
  const { data: user, error } = await supabase
    .from('system_users')
    .select('*')
    .eq('email', email)
    .single()

  if (error || !user) {
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
