const getters = {
  currentSinger: state => state.singer.currentSinger,
  currentSong: state => state.song.playList[state.song.currentIndex]
}

export default getters
