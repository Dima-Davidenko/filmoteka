import { Notify } from 'notiflix';
import Pagination from 'tui-pagination';
import refsMdl from './modules/refsMdl';
import storageAPI from './modules/storageAPI';
import { uiAPI } from './modules/uiAPI';
import storageAPI from './modules/storageAPI';
import galleryElementTpl from '../templates/galleryElement.hbs';
import modalMovieCardAPI from './modules/modalMovieCardAPI';
import footerModal from './modules/footerModal';
import fetchAPI from './modules/fetchAPI';
import firebaseAPI from './modules/firebaseAPI';
import respDataProc from './modules/responseDataProcessing';

export const currentAppState = {
  galleryState: 'popular',
  searchQuery: '',
  popular: { currentPage: 1 },
  search: { currentPage: 1 },
};

let pagination = null;

const showPopular = async () => {
  storageAPI.save('filters', []);
  refsMdl.filtersFormEl.reset();
  currentAppState.galleryState = 'popular';
  try {
    const response = await fetchAPI.instance.fetchPopular(currentAppState.popular.currentPage);
    console.log('Popular movies server response', response);
    const processedInfo = respDataProc.prepareMoviesInfo(response.results);
    uiAPI.renderGallery(processedInfo);
    refsMdl.paginationEl.classList.remove('is-hidden');
    pagination = new Pagination(refsMdl.paginationEl, {
      totalItems: response.total_results,
      itemsPerPage: 20,
      visiblePages: 5,
      centerAlign: true,
      page: currentAppState.popular.currentPage,
    });
    pagination.on('beforeMove', function (eventData) {
      currentAppState.popular.currentPage = eventData.page;
      console.log('scroll');
      window.scroll({
        top: 0,
        behavior: 'smooth',
      });
      showPopular();
    });
  } catch (error) {
    console.log(error);
    Notify.failure(error.message);
  }
};

function setActiveButton(button) {
  const activeBtn = document.querySelector('.current');
  activeBtn.classList.remove('current');
  button.classList.add('current');
}

function handleLogoBtnClick() {
  const event = new Event('click');
  refsMdl.homeBtnEl.dispatchEvent(event);
}

const handleHomeBtnClick = async e => {
  refsMdl.header.classList.remove('header--lybrary');
  setActiveButton(e.target);
  refsMdl.searchInputEl.value = '';
  refsMdl.searchFormEl.classList.remove('is-hidden');
  refsMdl.watchedBtnEl.classList.add('is-hidden');
  refsMdl.queuedBtnEl.classList.add('is-hidden');
  refsMdl.filtersFormEl.classList.remove('is-hidden');
  uiAPI.hideRegistrationInfo();
  currentAppState.popular.currentPage = 1;
  showPopular();
};

const showSearch = async () => {
  try {
    const response = await fetchAPI.instance.fetchSearch(
      currentAppState.searchQuery,
      currentAppState.search.currentPage
    );
    console.log(response);
    if (!response.results.length) {
      Notify.failure('Немає таких фільмів :)');
      return;
    }
    const processedInfo = respDataProc.prepareMoviesInfo(response.results);
    console.log(processedInfo);
    uiAPI.renderGallery(processedInfo);
    refsMdl.paginationEl.classList.remove('is-hidden');
    const pagination = new Pagination(refsMdl.paginationEl, {
      totalItems: response.total_results,
      itemsPerPage: 20,
      visiblePages: 5,
      centerAlign: true,
      page: currentAppState.search.currentPage,
    });
    pagination.on('beforeMove', function (eventData) {
      currentAppState.search.currentPage = eventData.page;
      console.log('scroll');
      window.scroll({
        top: 0,
        behavior: 'smooth',
      });
      showSearch();
    });
  } catch (error) {
    console.log(error);
    Notify.failure(error.message);
  }
};

const handleFormSubmit = async event => {
  currentAppState.galleryState = 'search';
  event.preventDefault();
  currentAppState.searchQuery = event.target.elements.searchQuery.value.trim();
  if (!currentAppState.searchQuery) return;
  currentAppState.search.currentPage = 1;
  currentAppState.galleryState = 'search';
  showSearch();
};

const handleLybraryBtnClick = async e => {
  refsMdl.paginationEl.classList.add('is-hidden');
  refsMdl.header.classList.add('header--lybrary');
  if (!firebaseAPI.instance.userId) uiAPI.showRegistrationInfo();
  setActiveButton(e.target);
  currentAppState.galleryState = 'watched';
  refsMdl.watchedBtnEl.classList.add('active');
  refsMdl.queuedBtnEl.classList.remove('active');
  refsMdl.searchFormEl.classList.add('is-hidden');
  refsMdl.watchedBtnEl.classList.remove('is-hidden');
  refsMdl.queuedBtnEl.classList.remove('is-hidden');
  refsMdl.filtersFormEl.classList.add('is-hidden');
  const watched = storageAPI.load('watched') || [];
  refsMdl.galleryEl.innerHTML = galleryElementTpl(watched);
};

const handleWatchedBtnClick = () => {
  currentAppState.galleryState = 'watched';
  refsMdl.watchedBtnEl.classList.add('active');
  refsMdl.queuedBtnEl.classList.remove('active');
  const watched = storageAPI.load('watched') || [];
  refsMdl.galleryEl.innerHTML = galleryElementTpl(watched);
};

const handleQueuedBtnClick = () => {
  currentAppState.galleryState = 'queue';
  refsMdl.queuedBtnEl.classList.add('active');
  refsMdl.watchedBtnEl.classList.remove('active');
  const queued = storageAPI.load('queue') || [];
  refsMdl.galleryEl.innerHTML = galleryElementTpl(queued);
};

const handleGalleryClick = async e => {
  const card = e.target.closest('.gallery__item');
  if (!card) return;
  const id = +card.dataset.id;
  try {
    const response = await fetchAPI.instance.fetchId(id);
    console.log('Full movie info', response);
    const processedInfo = respDataProc.prepareModalCardInfo(response);

    storageAPI.save('modalInfo', processedInfo);
    modalMovieCardAPI.showModalMovieCard(processedInfo);
  } catch (error) {
    console.log(error);
    Notify.failure(error.message);
  }
};

async function handleFilterFormChange({ target }) {
  const form = target.closest('.js-filters-form');
  let filters = [];
  console.dir(form);
  for (let i = 0; i < form.elements.length; i += 1) {
    if (form[i].name && form[i].value) {
      filters.push({ [form[i].name]: form[i].value });
    }
  }
  storageAPI.save('filters', filters);
  try {
    const response = await fetchAPI.instance.fetchFiltered();
    console.log(response);
    if (!response.results.length) {
      Notify.failure('Немає таких фільмів :)');
      return;
    }
    const processedInfo = respDataProc.prepareMoviesInfo(response.results);
    console.log(processedInfo);
    // instance.addToWatched(processedInfo[0]);
    uiAPI.renderGallery(processedInfo);
    refsMdl.paginationEl.classList.remove('is-hidden');
    pagination = new Pagination(refsMdl.paginationEl, {
      totalItems: response.total_results,
      itemsPerPage: 20,
      visiblePages: 5,
      centerAlign: true,
      page: currentAppState.search.currentPage,
    });
    pagination.on('beforeMove', function (eventData) {
      window.scroll({
        top: 0,
        behavior: 'smooth',
      });
      showFiltered(eventData.page);
    });
  } catch (error) {
    console.log(error);
    Notify.failure(error.message);
  }
}

async function showFiltered(page) {
  try {
    const response = await fetchAPI.instance.fetchFiltered(page);
    console.log(response);
    if (!response.results.length) {
      Notify.failure('Немає таких фільмів :)');
      return;
    }
    const processedInfo = respDataProc.prepareMoviesInfo(response.results);
    console.log(processedInfo);
    uiAPI.renderGallery(processedInfo);
  } catch (error) {
    console.log(error);
    Notify.failure(error.message);
  }
}

function handleUpBtnClick() {
  window.scroll({
    top: 0,
    behavior: 'smooth',
  });
}

refsMdl.logoEl.addEventListener('click', handleLogoBtnClick);
refsMdl.homeBtnEl.addEventListener('click', handleHomeBtnClick);

refsMdl.searchFormEl.addEventListener('submit', handleFormSubmit);

refsMdl.lybraryBtnEl.addEventListener('click', handleLybraryBtnClick);

refsMdl.watchedBtnEl.addEventListener('click', handleWatchedBtnClick);
refsMdl.queuedBtnEl.addEventListener('click', handleQueuedBtnClick);
refsMdl.upBtnEl.addEventListener('click', handleUpBtnClick);

refsMdl.galleryEl.addEventListener('click', handleGalleryClick);

refsMdl.filtersFormEl.addEventListener('change', handleFilterFormChange);
refsMdl.filtersResetBtnEl.addEventListener('click', showPopular);
refsMdl.themeSwitchFormEl.addEventListener('change', e => {
  const isDark = e.target.checked;
  if (isDark) {
    refsMdl.themeNameEl.textContent = 'Темна тема';
    refsMdl.body.classList.add('dark-theme');
  } else {
    refsMdl.themeNameEl.textContent = 'Світла тема';
    refsMdl.body.classList.remove('dark-theme');
  }
});

function upButton() {
  window.onscroll = function () {
    if (document.body.scrollTop > 400 || document.documentElement.scrollTop > 400) {
      refsMdl.upBtnEl.classList.add('up-button--visible');
    } else {
      refsMdl.upBtnEl.classList.remove('up-button--visible');
    }
  };
}

// refsMdl.teamDescrEl.addEventListener('click', handleTeamDescrClick);
currentAppState.popular.currentPage = Math.ceil(Math.random() * 1000);
showPopular();
upButton();
storageAPI.save('filters', []);

footerModal();
