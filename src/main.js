import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import lazyPlugin from 'vue3-lazy';
import loadingDirective from '@/components/Loading/index';
import noneDataDirective from '@/components/NoneData/directive';
import MessageBox from '@/components/MessageBox/index';
import Message from '@/components/Message/index';
import '@/assets/scss/index.scss';

createApp(App)
  .use(store)
  .use(router)
  .use(MessageBox)
  .use(Message)
  .use(lazyPlugin, {
    loading: require('@/assets/images/default.png'),
    error: require('@/assets/images/default.png'),
  })
  .directive('loading', loadingDirective)
  .directive('noneData', noneDataDirective)
  .mount('#app');
