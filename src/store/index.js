import { createStore, createLogger } from 'vuex'

import getters from './getters'
import singer from '@/store/modules/singer'
import song from '@/store/modules/song'

const debug = process.env.NODE_ENV !== 'production'
export default createStore({
  modules: {
    singer,
    song
  },
  getters,
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
