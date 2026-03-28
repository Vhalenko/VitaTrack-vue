import { createRouter, createWebHistory } from 'vue-router'
import LoginView  from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import DashboardView from '@/views/DashboardView.vue'
import FoodLogView from '@/views/FoodLogView.vue'
import ProfileView from '@/views/ProfileView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView
    },
    {
      path: '/food-log',
      name: 'food-log',
      component: FoodLogView
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView
    },
  ]
})

export default router