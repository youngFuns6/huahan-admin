import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    redirect: '/article',
  },
  {
    path: '/article',
    component: Layout,
    redirect: '/article/condition',
    name: 'Article',
    meta: { title: '文章管理', icon: 'form' },
    children: [{
      path: 'condition',
      name: 'Condition',
      component: () => import('@/views/condition/index'),
      meta: { title: '企业动态', icon: 'form' }
    },{
      path: 'news',
      name: 'News',
      component: () => import('@/views/news/index'),
      meta: { title: '行业资讯', icon: 'form' }
    }]
  },

  {
    path: '/goods',
    component: Layout,
    redirect: '/goods/type',
    name: 'Goods',
    meta: { title: '商品管理', icon: 'nested' },
    children: [
      {
        path: 'type',
        name: 'Type',
        component: () => import('@/views/type/index'),
        meta: { title: '商品分类', icon: 'table' }
      },
      {
        path: 'list',
        name: 'list',
        component: () => import('@/views/list/index'),
        meta: { title: '商品列表', icon: 'tree' }
      }
    ]
  },

  {
    path: '/info',
    component: Layout,
    redirect: '/info/seo',
    name: 'Info',
    meta: { title: '信息管理', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'seo',
        name: 'Seo',
        component: () => import('@/views/seo/index'),
        meta: { title: 'SEO优化', icon: 'table' }
      },
      {
        path: 'contact',
        name: 'Contact',
        component: () => import('@/views/contact/index'),
        meta: { title: '网站信息', icon: 'tree' }
      }
    ]
  },

  {
    path: '/feedback',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Feedback',
        component: () => import('@/views/feedback/index'),
        meta: { title: '网站反馈', icon: 'form' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
