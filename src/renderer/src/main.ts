import { createApp } from 'vue'
import '@assets/css/tailwind.css'
import App from './App.vue'
import router from '@renderer/router/index'
import { createPinia } from 'pinia'

// 如果您正在使用CDN引入，请删除下面一行。
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/es/components/message-box/style/index'

import './permission'

//国际化
import i18n from './locales/index'

import Pagination from '@components/Pagination.vue'
import PrFome from '@components/PrForm/index.vue'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 公共组件
app.component('Pagination', Pagination)
app.component('PrFome', PrFome)

// 状态管理
app.use(createPinia())
app.use(router)
app.use(i18n)
app.mount('#app')
