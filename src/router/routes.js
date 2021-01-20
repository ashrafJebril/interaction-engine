import {
  LocalStorage
} from 'quasar'

const routes = [{
    path: '/',
    name: 'home',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path:'',
        redirect:'Dashboard'
      },
      {
        path: 'Dashboard',
        name:"dashboard",
        component: () => import('pages/Index.vue')
      },
      {
        path: 'Discussion-Board',
        component: () => import('pages/DiscussionBoard.vue')
      },
      {
        path: 'Comments-Managments',
        component: () => import('pages/CommentsManagments.vue')
      },
      {
        path: 'user-Managments',
        component: () => import('pages/TAManagments.vue')
      },

    ],
    beforeEnter: (to, from, next) => {
      LocalStorage.getItem('isUserLoggedIn') ? next() : next('/login')
    }
  },
  {
    path: '/login',
    name: "login",
    component: () => import('pages/user/Login.vue')
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
