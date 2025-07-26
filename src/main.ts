import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from '@/stores'
import './assets/main.css'
import 'odos-ui/lib/umd/style.css'

const app = createApp(App)

app.use(router)
app.use(store)
app.mount('#app')
