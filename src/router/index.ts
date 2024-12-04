import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/frameextractor',
      name: 'frameextractor',
      component: () => import('../views/FrameExtractorView.vue'),
    },
    {
      path: '/canvasmeasuring',
      name: 'canvasmeasuring',
      component: () => import('../views/CanvasMeasuringView.vue'),
    },
    {
      path: '/fovexample',
      name: 'fovexample',
      component: () => import('../views/FOVExampleView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

export default router
