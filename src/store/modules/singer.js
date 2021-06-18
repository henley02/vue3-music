import storage from 'good-storage'
import { SINGER_KEY } from '@/js/constant'

const state = {
  currentSinger: storage.get(SINGER_KEY) || {}
}

const mutations = {
  SET_CURRENT_SINGER: (state, val) => {
    state.currentSinger = val
    storage.set(SINGER_KEY, val)
  }
}

const action = {}

export default ({
  namespaced: true,
  state,
  mutations,
  action
})
