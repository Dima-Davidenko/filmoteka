import galleryElement from '../../templates/galleryElement.hbs';
import modal from '../../templates/modal.hbs';

const genersEl = document.querySelectorAll('.item__category-js');

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
    // galleryContainer.innerHTML = modal(moviesListInfo);

      // genersEl.forEach(element => {
      //   // console.log(element.textContent.length);
      //   // element.textContent.split(" ").join(",")
      //   if (element.textContent.endsWith(',')) {
      //     // element.textContent.splice(element.textContent.length - 1, 1)
      //     // const text = element.textContent;
      //     // text.slice(0, text.length - 1);
      //     // console.log(text.slice(0, 3));
      //   }
      // });
  },
  renderHeader: () => {},
};
