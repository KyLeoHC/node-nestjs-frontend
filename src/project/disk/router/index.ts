import Vue from 'vue';
import VueRouter from 'vue-router';
import { publicPath } from '@/common/env';

Vue.use(VueRouter);

const project = 'disk';

/* eslint @typescript-eslint/explicit-function-return-type: 0 */
export default new VueRouter({
  mode: 'history',
  base: `${publicPath}${project}`,
  routes: [
    {
      name: 'login',
      path: '/login',
      component: () => import(/* webpackChunkName: "disk/list" */ '../views/login/index.vue')
    },
    {
      name: 'home',
      path: '/home',
      component: () => import(/* webpackChunkName: "disk/home" */ '../views/home/index.vue')
    }
  ]
});
