import { createStore, createLogger } from 'vuex';

import getters from './getters';
import singer from '@/store/modules/singer';
import song from '@/store/modules/song';
import album from '@/store/modules/album';
import ranking from '@/store/modules/ranking';

const debug = process.env.NODE_ENV !== 'production';
export default createStore({
  modules: {
    singer,
    song,
    album,
    ranking,
  },
  getters,
  strict: debug,
  plugins: debug ? [createLogger()] : [],
});
