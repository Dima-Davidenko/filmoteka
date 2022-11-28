import * as basicLightbox from 'basiclightbox';
import { firebaseInstance } from '../main';

import lybraryAPI from './lybraryAPI';
import storageAPI from './storageAPI';
import refsMdl from './refsMdl';
import { currentAppState } from '../main';

// import modalMovieCardTpl from '../../templates/modalMovieCard.hbs';
import modalMovieCardTpl from '../../templates/modal.hbs';
import galleryElementTpl from '../../templates/galleryElement.hbs';

async function showModalMovieCard(movieInfo) {
  let isWatched;
  let isQueued;

  if (firebaseInstance.userId) {
    try {
      isWatched = await firebaseInstance.isInLyb(movieInfo.id, 'watched');
      isQueued = await firebaseInstance.isInLyb(movieInfo.id, 'queue');
    } catch (error) {
      console.log(error);
    }
  } else {
    const watched = storageAPI.load('watched');
    isWatched = watched ? watched.find(movie => movie.id === movieInfo.id) : null;
    const queue = storageAPI.load('queue');
    isQueued = queue ? queue.find(movie => movie.id === movieInfo.id) : null;
  }

  refsMdl.modalMovieCardEl.innerHTML = modalMovieCardTpl(movieInfo);

  const watchBtn = refsMdl.modalMovieCardEl.querySelector('.js-watch-btn');
  const queueBtn = refsMdl.modalMovieCardEl.querySelector('.js-queue-btn');
  const closeBtn = refsMdl.modalMovieCardEl.querySelector('.btn-close');

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
        refsMdl.body.classList.add('modal-open');
        watchBtn.addEventListener('click', lybraryAPI.lybBtnClickAction);
        queueBtn.addEventListener('click', lybraryAPI.lybBtnClickAction);

        watchBtn.addEventListener('click', lybBtnClick);
        queueBtn.addEventListener('click', lybBtnClick);
      },
      onClose: () => {
        refsMdl.body.classList.remove('modal-open');
        watchBtn.removeEventListener('click', lybraryAPI.lybBtnClickAction);
        queueBtn.removeEventListener('click', lybraryAPI.lybBtnClickAction);
        closeBtn.removeEventListener('click', instance.close);

        watchBtn.removeEventListener('click', lybBtnClick);
        queueBtn.removeEventListener('click', lybBtnClick);
      },
    });
    closeBtn.addEventListener('click', instance.close);
    instance.show();
    setTimeout(() => {
      const backdrop = document.querySelector('.basicLightbox__placeholder');
      const modal = document.querySelector('.modal-window');
      // debugger;
      // if (modal.scrollHeight + 200 > document.documentElement.clientHeight) {
      backdrop.style.paddingTop = Math.round(modal.clientHeight / 2.4) + 'px';
      // }
    }, 50);
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
