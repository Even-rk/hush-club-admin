import { defineStore } from 'pinia'
import { ref } from 'vue'

interface UserInfo {
  id: number
  token: string
  real_name: string
  username: string
  last_login_time: string
}

const useUserStore = defineStore(
  'user-info',
  () => {
    const userInfo = ref({} as UserInfo)

    const setUserInfo = (user_info: UserInfo) => {
      userInfo.value = user_info
    }

    return { userInfo, setUserInfo }
  },
  {
    persist: {
      storage: localStorage
    }
  }
)

export default useUserStore
