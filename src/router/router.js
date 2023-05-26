import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/home.vue'
import Param from '../views/param/index.vue'
import Repo from '../views/repo/index.vue'
import Login from '../views/login.vue'

const routes = [
    {
        path: '/',
        redirect: '/param',
    },
    {
        path: '/',
        name: 'home',
        component: Home,
        children: [
            {
                path: '/param',
                name: 'param',
                meta: {
                    title: '参数管理'
                },
                component: Param,
            }, {
                path: '/repo',
                name: 'repo',
                meta: {
                    title: '代码仓库'
                },
                component: Repo,
            },
        ]
    },
    {
        path: '/login',
        name: 'login',
        meta: {
            title: '登录'
        },
        component: Login,
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    if (to.fullPath != '/login') {
        let token = localStorage.getItem('token')
        console.log('token =', token);
        if (!token) {
            console.log('login');
            next('/login')
            return
        }
    }
    next()
})

export default router
