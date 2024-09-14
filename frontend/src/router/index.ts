import { routeConfig } from './_config';
import { decodeUserNow } from '@/Helpers/decodeUser';
import { createRouter, createWebHistory } from 'vue-router';

export const ROUTES_ADMIN = ({ isAdmin }: any, components: any) => {
  if (!isAdmin) return components.USER;
  if (isAdmin) return components.ADMIN;
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routeConfig(ROUTES_ADMIN, decodeUserNow)
});

router.beforeEach((to: any, from: any) => {
  let isAuth = false;

  if (decodeUserNow()) isAuth = true
  else isAuth = false;

  if (to.name === undefined) {
    return "/";
  }

  if (to.name.includes("dash-") && !isAuth) return "/";
  if (to.name.includes("auth-") && isAuth) return "/dashboard";
});

export default router;