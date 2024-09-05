import { createPinia } from 'pinia'
import { createApp } from 'vue'
import Antd from 'ant-design-vue';
import App from './app.vue'
import '../assets/base.scss'
import './index.scss'
import {router} from "@/options/router";
import 'ant-design-vue/dist/reset.css';
// router

// routes.push({
//   path: '/',
//   redirect: '/options',
// })



createApp(App).use(Antd).use(router).use(createPinia()).mount('#app')

// console.log(router.getRoutes())

// self.onerror = function (message, source, lineno, colno, error) {
//   console.info(
//     `Error: ${message}\nSource: ${source}\nLine: ${lineno}\nColumn: ${colno}\nError object: ${error}`
//   )
// }
