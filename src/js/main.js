import { Notify } from 'notiflix';
import Pagination from 'tui-pagination';
import refsMdl from './modules/refsMdl';
import fetchAPIclass from './modules/fetchAPI';
import storageAPI from './modules/storageAPI';
import { genresList } from './utils/genresList';
import { uiAPI } from './modules/uiAPI';
import firebaseAPI from './modules/firebaseAPI';
import storageAPI from './modules/storageAPI';
import galleryElementTpl from '../templates/galleryElement.hbs';
import modalMovieCardAPI from './modules/modalMovieCardAPI';
import footerModal from './modules/footerModal';
import fetchAPI from './modules/fetchAPI';

export const firebaseInstance = new firebaseAPI(refsMdl.signInBtnEl, refsMdl.signOutBtnEl);
export const currentAppState = {
  galleryState: 'popular',
  searchQuery: '',
  popular: { currentPage: 1, totalPages: null },
  search: { currentPage: 1, totalPages: null },
  watched: { currentPage: 1, totalPages: null },
  queued: { currentPage: 1, totalPages: null },
};
const fetchAPIinstance = new fetchAPI();

const noImageUrl = new URL('../images/elementBackup/imageNotAvailable.jpg', import.meta.url);
// let galleryState = 'popular';

const getOneMovieInfo = movieInfo => {
  const id = movieInfo?.id;
  const title = movieInfo?.title;
  const posterUrl = movieInfo?.poster_path
    ? `https://image.tmdb.org/t/p/w500${movieInfo.poster_path}`
    : null;
  const genres = movieInfo?.genre_ids
    ? movieInfo.genre_ids.map(genreId => genresList[genreId]).join(', ')
    : '';
  let year = '';
  if (movieInfo?.release_date) {
    year = movieInfo.release_date?.length ? movieInfo?.release_date.slice(0, 4) : '';
  }

  const noImage = noImageUrl.pathname;
  return { title, posterUrl, genres, year, id, noImage };
};

const prepareMoviesInfo = moviesArr => {
  return moviesArr.map(getOneMovieInfo);
};
const prepareModalCardInfo = movieInfo => {
  const id = movieInfo.id;
  const title = movieInfo?.title || 'No Title';
  const vote_average = movieInfo?.vote_average || 'No Votes';
  const vote_count = movieInfo?.vote_count || 'No Votes';
  const popularity = movieInfo?.popularity || 'No Rates';
  const genres = movieInfo?.genres.map(genre => genre.name).join(', ') || '';
  const original_title = movieInfo?.original_title || 'No Title';
  const overview = movieInfo?.overview || 'No overview';
  let year = '';
  if (movieInfo?.release_date) {
    year = movieInfo.release_date?.length ? movieInfo?.release_date.slice(0, 4) : '';
  }
  const noImage = noImageUrl.pathname;
  let posterUrl = '';
  if (movieInfo?.poster_path) {
    posterUrl = `https://image.tmdb.org/t/p/w500${movieInfo.poster_path}`;
  }
  const video = movieInfo?.videos?.length ? movieInfo.videos[0].key : null;
  return {
    id,
    title,
    vote_average,
    vote_count,
    popularity,
    genres,
    original_title,
    overview,
    year,
    posterUrl,
    noImage,
    video,
  };
};

const showPopular = async () => {
  storageAPI.save('filters', []);
  refsMdl.filtersFormEl.reset();
  currentAppState.galleryState = 'popular';
  try {
    const response = await fetchAPIinstance.fetchPopular(currentAppState.popular.currentPage);
    currentAppState.popular.totalPages = response.total_pages;
    console.log('Popular movies server response', response);
    const processedInfo = prepareMoviesInfo(response.results);
    uiAPI.renderGallery(processedInfo);
    refsMdl.paginationEl.classList.remove('is-hidden');
    const pagination = new Pagination(refsMdl.paginationEl, {
      totalItems: response.total_results,
      itemsPerPage: 20,
      visiblePages: 10,
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
    const response = await fetchAPIinstance.fetchSearch(
      currentAppState.searchQuery,
      currentAppState.search.currentPage
    );
    console.log(response);
    if (!response.results.length) {
      Notify.failure('Немає таких фільмів :)');
      return;
    }
    const processedInfo = prepareMoviesInfo(response.results);
    console.log(processedInfo);
    // firebaseInstance.addToWatched(processedInfo[0]);
    uiAPI.renderGallery(processedInfo);
    refsMdl.paginationEl.classList.remove('is-hidden');
    const pagination = new Pagination(refsMdl.paginationEl, {
      totalItems: response.total_results,
      itemsPerPage: 20,
      visiblePages: 10,
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
  if (!firebaseInstance.userId) uiAPI.showRegistrationInfo();
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

const handlePaginationClick = e => {};

const handleGalleryClick = async e => {
  const card = e.target.closest('.gallery__item');
  if (!card) return;
  const id = +card.dataset.id;
  try {
    const response = await fetchAPIinstance.fetchId(id);
    console.log('Full movie info', response);
    const processedInfo = prepareModalCardInfo(response);

    storageAPI.save('modalInfo', processedInfo);
    modalMovieCardAPI.showModalMovieCard(processedInfo);
  } catch (error) {
    console.log(error);
    Notify.failure(error.message);
  }
};

async function handleFilterFormChange({ target }) {
  // console.dir(target);
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
    const response = await fetchAPIinstance.fetchFiltered();
    console.log(response);
    if (!response.results.length) {
      Notify.failure('Немає таких фільмів :)');
      return;
    }
    const processedInfo = prepareMoviesInfo(response.results);
    console.log(processedInfo);
    // firebaseInstance.addToWatched(processedInfo[0]);
    uiAPI.renderGallery(processedInfo);
    refsMdl.paginationEl.classList.remove('is-hidden');
    const pagination = new Pagination(refsMdl.paginationEl, {
      totalItems: response.total_results,
      itemsPerPage: 20,
      visiblePages: 10,
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
    const response = await fetchAPIinstance.fetchFiltered(page);
    console.log(response);
    if (!response.results.length) {
      Notify.failure('Немає таких фільмів :)');
      return;
    }
    const processedInfo = prepareMoviesInfo(response.results);
    console.log(processedInfo);
    // firebaseInstance.addToWatched(processedInfo[0]);
    uiAPI.renderGallery(processedInfo);
  } catch (error) {
    console.log(error);
    Notify.failure(error.message);
  }
}
// const handleTeamDescrClick = () => {};

function handleFiltersResetBtnClick() {
  storageAPI.save('filters', []);
  showPopular();
}

refsMdl.logoEl.addEventListener('click', handleLogoBtnClick);
refsMdl.homeBtnEl.addEventListener('click', handleHomeBtnClick);

refsMdl.searchFormEl.addEventListener('submit', handleFormSubmit);

refsMdl.lybraryBtnEl.addEventListener('click', handleLybraryBtnClick);

refsMdl.watchedBtnEl.addEventListener('click', handleWatchedBtnClick);
refsMdl.queuedBtnEl.addEventListener('click', handleQueuedBtnClick);

// refsMdl.paginationEl.addEventListener('click', handlePaginationClick);

refsMdl.galleryEl.addEventListener('click', handleGalleryClick);

refsMdl.filtersFormEl.addEventListener('change', handleFilterFormChange);
refsMdl.filtersResetBtnEl.addEventListener('click', showPopular);

// refsMdl.teamDescrEl.addEventListener('click', handleTeamDescrClick);
currentAppState.popular.currentPage = Math.ceil(Math.random() * 1000);
showPopular();
storageAPI.save('filters', []);

footerModal();
