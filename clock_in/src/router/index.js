import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login.vue'
import Home from '../components/Home/home.vue'
import Integral from '../components/Home/Integral.vue'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/home',
        component: Home
    },
    {
        path: '/integral',
        component: Integral
    },
]

const router = new VueRouter({
    routes
})

// 路由守卫
// router.beforeEach((to, from, next) => {
//     if (to.path === '/login' || to.path === '/login') return next()
//     const str = window.sessionStorage.getItem('token')
//     if (!str) return next('/login')
//     console.log(123);
//     next()
// })
router.beforeEach((to, from, next) => {
    const str = window.localStorage.getItem('token')
    if (to.path === '/home' || to.path === '/integral') {
        if (!str) {
            alert('请登录')
            next('/login')
        } else {
            next()
        }
    } else {
        next()
    }
})

export default router