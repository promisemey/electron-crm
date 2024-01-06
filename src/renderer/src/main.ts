import '@assets/css/tailwind.css'
import Loading from '@components/Loading.vue'
import Pagination from '@components/Pagination.vue'
import PrFome from '@components/PrForm/index.vue'
import { ButtonAuthDirective } from '@directives/auth'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import router from '@renderer/router/index'
import 'element-plus/es/components/message-box/style/index'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createApp } from 'vue'
import App from './App.vue'
import i18n from './locales/index'
import './permission'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 公共组件
app.component('Pagination', Pagination)
app.component('PrFome', PrFome)
app.component('Loading', Loading)

app.directive(ButtonAuthDirective.name, ButtonAuthDirective)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

// 状态管理
app.use(pinia)
app.use(router)
app.use(i18n)
app.mount('#app')
