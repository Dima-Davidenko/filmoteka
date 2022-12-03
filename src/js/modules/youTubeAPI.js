import storageAPI from './storageAPI';
import fetchAPI from './fetchAPI';
import firebaseAPI from './firebaseAPI';
import * as basicLightbox from 'basiclightbox';

function setActionByYTStatus(trailerBtn) {
  const YTStatus = storageAPI.load('YTStatus');
  if (YTStatus.status) {
    trailerBtn.dataset.action = 'find';
  } else {
    trailerBtn.classList.add('is-hidden');
  }
}

async function getYTSearch() {
  try {
    const movieInfo = storageAPI.load('modalInfo');
    const response = await fetchAPI.instanceYT.fetchYTSearch(
      `movie ${movieInfo.original_title} ${movieInfo.year} official trailer`
    );
    return response;
  } catch (error) {
    firebaseAPI.instance.setYouTubeStatus(Date.now(), false);
    return null;
  }
}

function createYTIframe(videoKey) {
  const markup = `<iframe src="https://www.youtube.com/embed/${videoKey}" data-index="iframe" frameborder="0" allow="accelerometer; autoplay; clipboard-write;
    encrypted-media; gyroscope; picture-in-picture" allowfullscreen="">
    </iframe>`;
  const instance = basicLightbox.create(markup);
  instance.show();
}

export default {
  setActionByYTStatus,
  getYTSearch,
  createYTIframe,
};
