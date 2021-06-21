import { PLAY_MODE } from '@/js/constant'
import { shuffle } from '@/js/util'

const state = {
  /**
   * 原始数据
   */
  sequenceList: [],
  /**
   * 播放列表
   */
  playList: [],
  /**
   * 是否在播放中
   */
  playing: false,
  /***
   * 播放模式
   */
  playMode: PLAY_MODE.sequence,
  /**
   * 当前模仿的索引
   */
  currentIndex: 0,
  /**
   * 是否全屏
   */
  fullScreen: false
}

const mutations = {
  SET_PLAYING_STATE (state, playing) {
    state.playing = playing
  },
  SET_SEQUENCE_LIST (state, list) {
    state.sequenceList = list
  },
  SET_PLAY_LIST (state, list) {
    state.playList = list
  },
  SET_PLAY_MODE (state, mode) {
    state.playMode = mode
  },
  SET_CURRENT_INDEX (state, index) {
    state.currentIndex = index
  },
  SET_FULL_SCREEN (state, fullScreen) {
    state.fullScreen = fullScreen
  }
}

const actions = {
  selectPlay ({ commit, state }, { list, index }) {
    commit('SET_PLAY_MODE', PLAY_MODE.sequence)
    commit('SET_SEQUENCE_LIST', list)
    commit('SET_PLAYING_STATE', true)
    commit('SET_FULL_SCREEN', true)
    commit('SET_PLAY_LIST', list)
    commit('SET_CURRENT_INDEX', index)
  },
  randomPlay ({ commit }, { list }) {
    commit('SET_PLAY_MODE', PLAY_MODE.random)
    commit('SET_SEQUENCE_LIST', list)
    commit('SET_PLAYING_STATE', true)
    commit('SET_FULL_SCREEN', true)
    commit('SET_PLAY_LIST', shuffle(list))
    commit('SET_CURRENT_INDEX', 0)
  }
}

export default ({
  namespaced: true,
  state,
  mutations,
  actions
})
