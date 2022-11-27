import galleryElementTpl from '../../templates/galleryElement.hbs';
import storageAPI from './storageAPI';
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
  renderGallery: moviesListInfo => {
    console.log('Info for gallery rendering', moviesListInfo);

    // console.log(galleryElement);
    galleryContainer.innerHTML = galleryElementTpl(moviesListInfo);
    storageAPI.save('gallery', moviesListInfo);
  },
  renderHeader: () => {},
  renderMainHeader: () => {},
};
