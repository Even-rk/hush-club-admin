import { defineStore } from 'pinia'
import { ref } from 'vue'

const useUserStore = defineStore('user-info', () => {
  const userInfo = ref({
    token: ''
  })

  const setUserInfo = (token: string) => {
    userInfo.value = {
      token: token
    }
  }

  return { userInfo, setUserInfo }
})

export default useUserStore
