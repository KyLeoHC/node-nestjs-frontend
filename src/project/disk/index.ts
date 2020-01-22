/* eslint no-unused-vars: 0 */
import Vue, { VNode } from 'vue';
import {
  loadCSSByArray
} from '@/utils';
import polyfill from '@/common/polyfill';
import router from './router';
import App from './app.vue';
import {
  Field,
  Button,
  NavBar,
  PullRefresh,
  CellGroup,
  Toast,
  Icon,
  Popup,
  Dialog,
  Locale
} from 'vant';
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import enUS from 'vant/lib/locale/lang/en-US';

polyfill();

Locale.use('en-US', enUS);
Toast.setDefaultOptions('loading', {
  forbidClick: true,
  duration: 0
});
Vue.use(Field)
  .use(Button)
  .use(NavBar)
  .use(CellGroup)
  .use(PullRefresh)
  .use(Toast)
  .use(Icon)
  .use(Popup)
  .use(Dialog);

loadCSSByArray([
  '//at.alicdn.com/t/font_1007376_mqnhabrqmch.css',
  ...(window.__cssList || [])
]).finally((): void => {
  new Vue({
    router,
    render: (h): VNode => h(App)
  }).$mount('#app');
});
