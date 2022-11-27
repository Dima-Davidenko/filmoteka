import * as basicLightbox from 'basiclightbox';
import { firebaseInstance } from '../main';

import lybraryAPI from './lybraryAPI';
import storageAPI from './storageAPI';
import refsMdl from './refsMdl';
import { currentAppState } from '../main';

import modalMovieCardTpl from '../../templates/modalMovieCard.hbs';
import galleryElementTpl from '../../templates/galleryElement.hbs';

async function showModalMovieCard(movieInfo) {
  const isWatched = await firebaseInstance.isInLyb(movieInfo.id, 'watched');

  const isQueued = await firebaseInstance.isInLyb(movieInfo.id, 'queue');

  refsMdl.modalMovieCardEl.innerHTML = modalMovieCardTpl(movieInfo);

  const watchBtn = document.querySelector('.js-watch-btn');
  const queueBtn = document.querySelector('.js-queue-btn');

  if (isWatched) {
    watchBtn.textContent = 'Remove from watched';
    watchBtn.dataset.action = 'remove';
  } else {
    watchBtn.textContent = 'Add to watched';
    watchBtn.dataset.action = 'add';
  }

  if (isQueued) {
    queueBtn.textContent = 'Remove from queue';
    queueBtn.dataset.action = 'remove';
  } else {
    queueBtn.textContent = 'Add to queue';
    queueBtn.dataset.action = 'add';
  }

  if (!document.querySelector('.basicLightbox')) {
    const instance = basicLightbox.create(refsMdl.modalMovieCardEl, {
      onShow: () => {
        watchBtn.addEventListener('click', lybraryAPI.lybBtnClickAction);
        queueBtn.addEventListener('click', lybraryAPI.lybBtnClickAction);

        watchBtn.addEventListener('click', lybBtnClick);
        queueBtn.addEventListener('click', lybBtnClick);
      },
      onClose: () => {
        watchBtn.removeEventListener('click', lybraryAPI.lybBtnClickAction);
        queueBtn.removeEventListener('click', lybraryAPI.lybBtnClickAction);

        watchBtn.removeEventListener('click', lybBtnClick);
        queueBtn.removeEventListener('click', lybBtnClick);
      },
    });
    instance.show();
  }
}

function lybBtnClick(e) {
  toggleButtonsType(e.target);
  // showLybrary(e.target.dataset.type);
}

function toggleButtonsType(btn) {
  const arr = btn.textContent.split(' ');
  arr.splice(1, 1);
  arr[0] = arr[0] === 'Add' ? 'Remove from' : 'Add to';
  btn.textContent = arr.join(' ');
  btn.dataset.action = btn.dataset.action === 'add' ? 'remove' : 'add';
}

function showLybrary(type) {
  if (currentAppState.galleryState !== type) return;
  const lyb = storageAPI.load(currentAppState.galleryState) || [];
  refsMdl.galleryEl.innerHTML = galleryElementTpl(lyb);
}

export default {
  showModalMovieCard,
  showLybrary,
};
