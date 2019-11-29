import Vue from 'vue'
import VueRouter from 'vue-router'

// 引入组件
import login from '@/models/login.vue'
import casLogin from '@/models/casLogin.vue'
import home from '@/models/home/homeBridging.vue'

// 要告诉 vue 使用 vueRouter
Vue.use(VueRouter)

const routes = [
  {
    name:"root",
    path: '/',
    // redirect: 'casLogin'
    redirect: 'login'
  },
  {
    path: `/login`,
    component: login
  },
  {
    path: `/casLogin`,
    component: casLogin
  },
  {
    path: `/mockLogin`,
    component: () => import("@/models/mockLogin")
  },
  {
    path: `/home`,
    component: home,
    props: { menuAlign: 'top' },//left==>菜单在左侧 top==>菜单在上方
    // props: { menuAlign: 'left' },//left==>菜单在左侧 top==>菜单在上方
    children: [
      {
        path: `/welcome`,
        component: () => import("@/models/home/welcome")
      },
      {
        name: 'auth',
        path: '/auth',
        component: () => import('@/models/sys/main'),
        children:[
          {
            name: 'menu',
            path: '/sys/menu',
            component: () => import('@/models/sys/menu/menuMain')
          },
          {
            name: 'user',
            path: '/sys/user',
            component: () => import('@/models/sys/user/userMain')
          },
          {
            name: 'role',
            path: '/sys/role',
            component: () => import('@/models/sys/role/roleMain')
          },
          { 
            name: 'contacts',
            path: '/sys/contacts',
            component: () => import('@/models/sys/contacts/contactsMain')//联系人管理
          },
          {
            name: 'dataConsumptionPlan',
            path: '/sys/dataConsumptionPlan',
            component: () => import('@/models/sys/dataConsumptionPlan/consumptionMain')//数据消费计划
          },
          {
            name: 'dataProductionPlan',
            path: '/sys/dataProductionPlan',
            component: () => import('@/models/sys/dataProductionPlan/productionMain')//数据生产计划
          },
          {
            name: 'dataAdministration',
            path: '/sys/dataAdministration',
            component: () => import('@/models/sys/dataAdministration/administrationMain')//数据集管理
          },
          {
            name: 'appProjectAdministration',
            path: '/sys/appProjectAdministration',
            component: () => import('@/models/sys/appProjectAdministration/projectMain')//应用项目管理
          }
        ]
      }
    ]
  }
]

var router =  new VueRouter({
  routes
})
export default router
