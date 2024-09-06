import '@/assets/base.scss'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './app.vue'
import routes from '~pages'
import './index.scss'

// eslint-disable-next-line import/order
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';

routes.push({
  path: '/',
  redirect: '/popup',
})

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
})

createApp(App).use(Antd).use(router).use(createPinia()).mount('#app')
// chrome.scripting.executeScript()
// console.log(router.getRoutes())

self.onerror = function (message, source, lineno, colno, error) {
  console.info(
    `Error: ${message}\nSource: ${source}\nLine: ${lineno}\nColumn: ${colno}\nError object: ${error}`
  )
}
