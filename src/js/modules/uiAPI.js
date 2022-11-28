import galleryElement from '../../templates/galleryElement.hbs';
import modal from '../../templates/modal.hbs';

const genersEl = document.querySelectorAll('.item__category-js');
import storageAPI from './storageAPI';
import refsMdl from './refsMdl';
const galleryContainer = document.querySelector('.js-gallery');

export const uiAPI = {
  renderGallery: moviesListInfo => {
    console.log('Info for gallery rendering', moviesListInfo);

    galleryContainer.innerHTML = galleryElement(moviesListInfo);
    storageAPI.save('gallery', moviesListInfo);
  },
  showLoadingInfo: () => {
    refsMdl.loadingInfoEl.classList.remove('is-hidden');
  },
  hideLoadingInfo: () => {
    refsMdl.loadingInfoEl.classList.add('is-hidden');
  },
  renderMainHeader: () => {},
  showSignInInfo: () => {},
};
