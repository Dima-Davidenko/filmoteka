import galleryElement from '../../templates/galleryElement.hbs';
const galleryContainer = document.querySelector('.js-gallery');

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

    // console.log(galleryElement);
    galleryContainer.innerHTML = galleryElement(moviesListInfo);
  },
  renderHeader: () => {},
  renderMainHeader: () => {},
};
