import Vue from 'vue'
import VueRouter from 'vue-router'
const Login = () => import('../components/Login.vue')
const Home = () => import('../components/Home.vue')
const Welcome = () => import('../components/Welcome.vue')
const Users = () => import('../components/user/Users.vue')
const Rights = () => import('../components/power/Rights.vue')
const Roles = () => import('../components/power/Roles.vue')
const Cate = () => import('../components/goods/Cate.vue')
const Param = () => import('../components/goods/Param.vue')
const List = () => import('../components/goods/List.vue')
const AddGoods = () => import('../components/goods/AddGoods.vue')
const Orders = () => import('../components/order/Orders.vue')


Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home', component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Cate },
      { path: '/params', component: Param },
      { path: '/goods', component: List },
      { path: '/goods/add', component: AddGoods },
      { path: '/orders', component: Orders },
    ]
  },
]

const router = new VueRouter({
  routes
})



router.beforeEach((to, from, next) => {

  if (to.path === '/login') return next()

  const token = window.sessionStorage.getItem('token')
  if (!token) return next("/login")

  next()

})

export default router
