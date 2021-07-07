const getters = {
  currentRanking: (state) => state.ranking.currentRanking,
  currentAlbum: (state) => state.album.currentAlbum,
  currentSinger: (state) => state.singer.currentSinger,
  currentSong: (state) => state.song.playList[state.song.currentIndex] || {},
};

export default getters;
