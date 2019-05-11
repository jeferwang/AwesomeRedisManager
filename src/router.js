import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: () => import('@/views/Layouts/MainLayout/MainLayout'),
      redirect: '/Welcome/Index',
      children: [
        {
          path: '/Welcome/Index',
          component: () => import('@/views/Pages/Welcome/Index')
        }
      ]
    }
  ]
})
