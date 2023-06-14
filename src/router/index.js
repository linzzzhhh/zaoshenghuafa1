import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'login',
    component: () => import(/* webpackChunkName: "about" */ '../views/login')
  },
  {
    path: '/home',
    name: '首页',
    component: () => import(/* webpackChunkName: "about" */ '../views/layout'),
    redirect: '/home',
    children: [
      {
        path: '/home',
        name: '首页',
        component: () => import(/* webpackChunkName: "about" */ '../views/home/index')
      },
      {
        path: '/category',
        name: '问题类型',
        component: () => import(/* webpackChunkName: "about" */ '../views/category/index')
      },
      {
        path: '/question',
        name: '题目管理',
        component: () => import(/* webpackChunkName: "about" */ '../views/question/index')
      },
      {
        path: '/assembly',
        name: '组卷',
        component: () => import(/* webpackChunkName: "about" */ '../views/assembly/index')
      },
      {
        path: '/survey',
        name: '问卷',
        component: () => import(/* webpackChunkName: "about" */ '../views/survey/index')
      },
      {
        path: '/result',
        name: '答卷记录',
        component: () => import(/* webpackChunkName: "about" */ '../views/result/index')
      },
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
