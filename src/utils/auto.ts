import { supabase } from './supabase'
import { formatDate } from './format'

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

  return {
    id: user.id as number,
    token: supabaseUser.session?.access_token as string,
    last_login_time: user.last_login_time as string,
    real_name: user.real_name as string,
    username: user.username as string
  }
}
