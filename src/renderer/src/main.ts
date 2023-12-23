import { createApp } from 'vue'
import '@assets/css/tailwind.css'
import App from './App.vue'
import router from '@renderer/router/index'
import { createPinia } from 'pinia'

// 如果您正在使用CDN引入，请删除下面一行。
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

//国际化
import i18n from './locales/index'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 状态管理
app.use(router)
app.use(createPinia())
app.use(i18n)
app.mount('#app')
