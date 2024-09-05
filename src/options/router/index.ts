import {createRouter, createWebHashHistory} from "vue-router/auto";
// import routes from "~pages";

import IndexComp from "../pages/Index.vue"
import AboutComp from "../pages/About.vue"


// const setupType = new URLSearchParams(window.location.search).get('type')

export const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            // redirect: "/options/index",
            component: IndexComp,
            meta: {
                title: "在线AI翻译_大模型翻译_划词翻译"
            }
        },
        {
            path: '/options/about',
            name: 'about',
            component: AboutComp
        }
    ],
})

router.beforeEach((to, _from, next) => {
    //


    // if (to.path === '/' || to.path === '/setup') {
    //     if (setupType === 'install') {
    //         return next('/setup/install')
    //     } else {
    //         return next('/setup/update')
    //     }
    // }

    next()
})
