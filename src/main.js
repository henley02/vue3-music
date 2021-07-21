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

import { load, saveAll } from '@/js/array-store';
import { FAVORITE_KEY, PLAY_KEY } from '@/js/constant';
import { processSongs } from '@/service/song';

const favoriteSongs = load(FAVORITE_KEY);
if (favoriteSongs.length > 0) {
  processSongs(favoriteSongs).then((songs) => {
    store.commit('song/SET_FAVORITE_LIST', songs);
    saveAll(FAVORITE_KEY, songs);
  });
}

const historySongs = load(PLAY_KEY);
if (historySongs.length > 0) {
  processSongs(historySongs).then((songs) => {
    store.commit('song/SET_PLAY_HISTORY', songs);
    saveAll(PLAY_KEY, songs);
  });
}

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
