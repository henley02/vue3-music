const getters = {
  currentRanking: (state) => state.ranking.currentRanking,
  currentAlbum: (state) => state.album.currentAlbum,
  currentSinger: (state) => state.singer.currentSinger,
  currentSong: (state) => state.song.playList[state.song.currentIndex] || {},
  searchHistory: (state) => state.searchHistory.list || [],
};

export default getters;
