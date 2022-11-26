export const uiAPI = {
  state: {
    type: 'popular',
    popular: {
      currentPage: 1,
      totalPages: null,
    },
    searched: {
      currentPage: 1,
      totalPages: null,
    },
  },
  renderList: moviesListInfo => {
    console.log(moviesListInfo);
  },
  renderHeader: () => {},
  renderMainHeader: () => {},
};
