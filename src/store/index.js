import Vuex from 'vuex'

import singer from '@/store/modules/singer'
import getters from './getters'

const store = new Vuex.Store({
  modules: {
    singer
  },
  getters
})

export default store
