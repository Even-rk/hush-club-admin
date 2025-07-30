import { UserInfo } from '@/types/stores'
import { defineStore } from 'pinia'
import { ref } from 'vue'

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
