import { Notify } from 'notiflix';
import Pagination from 'tui-pagination';
import '~/node_modules/tui-pagination/dist/tui-pagination.min.css';
import refsMdl from './modules/refsMdl';
import fetchAPI from './modules/fetchAPI';
import storageAPI from './modules/storageAPI';
import { genresList } from './utils/genresList';
import { uiAPI } from './modules/uiAPI';
import firebaseAPI from './modules/firebaseAPI';
import storageAPI from './modules/storageAPI';
import galleryElementTpl from '../templates/galleryElement.hbs';
import modalMovieCardAPI from './modules/modalMovieCardAPI';

export const firebaseInstance = new firebaseAPI(refsMdl.signInBtnEl, refsMdl.signOutBtnEl);
export const currentAppState = {
  galleryState: 'popular',
  searchQuery: '',
  popular: { currentPage: 1, totalPages: null },
  search: { currentPage: 1, totalPages: null },
  watched: { currentPage: 1, totalPages: null },
  queued: { currentPage: 1, totalPages: null },
};

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
  const year = movieInfo?.release_date.slice(0, 4);
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
  const genres = movieInfo?.genres.map(genre => genre.name).join(', ') || null;
  const original_title = movieInfo?.original_title || 'No Title';
  const overview = movieInfo?.overview || 'No overview';
  const year = movieInfo?.release_date.slice(0, 4) || 'No date';
  const noImage = noImageUrl.pathname;
  let posterUrl = '';
  if (movieInfo?.poster_path) {
    posterUrl = `https://image.tmdb.org/t/p/w500${movieInfo.poster_path}`;
  }
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
  };
};

const showPopular = async () => {
  currentAppState.galleryState = 'popular';
  try {
    const response = await fetchAPI.fetchPopular(currentAppState.popular.currentPage);
    currentAppState.popular.totalPages = response.total_pages;
    console.log('Popular movies server response', response);
    const processedInfo = prepareMoviesInfo(response.results);
    uiAPI.renderGallery(processedInfo);
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
    console.log('1');
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
  setActiveButton(e.target);
  refsMdl.searchInputEl.value = '';
  refsMdl.searchFormEl.classList.remove('is-hidden');
  refsMdl.watchedBtnEl.classList.add('is-hidden');
  refsMdl.queuedBtnEl.classList.add('is-hidden');
  currentAppState.popular.currentPage = 1;
  showPopular();
};

const showSearch = async () => {
  try {
    const response = await fetchAPI.fetchSearch(
      currentAppState.searchQuery,
      currentAppState.search.currentPage
    );
    console.log(response);
    const processedInfo = prepareMoviesInfo(response.results);
    console.log(processedInfo);
    // firebaseInstance.addToWatched(processedInfo[0]);
    uiAPI.renderGallery(processedInfo);
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
    console.log('2');
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
  if (!firebaseInstance.userId) uiAPI.showLoadingInfo();
  setActiveButton(e.target);
  currentAppState.galleryState = 'watched';
  refsMdl.watchedBtnEl.classList.add('active');
  refsMdl.queuedBtnEl.classList.remove('active');
  refsMdl.searchFormEl.classList.add('is-hidden');
  refsMdl.watchedBtnEl.classList.remove('is-hidden');
  refsMdl.queuedBtnEl.classList.remove('is-hidden');
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
    const response = await fetchAPI.fetchId(id);
    console.log('Full movie info', response);
    const processedInfo = prepareModalCardInfo(response);

    storageAPI.save('modalInfo', processedInfo);
    modalMovieCardAPI.showModalMovieCard(processedInfo);
  } catch (error) {
    console.log('3');
    Notify.failure(error.message);
  }
};

// const handleTeamDescrClick = () => {};

refsMdl.logoEl.addEventListener('click', handleLogoBtnClick);
refsMdl.homeBtnEl.addEventListener('click', handleHomeBtnClick);

refsMdl.searchFormEl.addEventListener('submit', handleFormSubmit);

refsMdl.lybraryBtnEl.addEventListener('click', handleLybraryBtnClick);

refsMdl.watchedBtnEl.addEventListener('click', handleWatchedBtnClick);
refsMdl.queuedBtnEl.addEventListener('click', handleQueuedBtnClick);

// refsMdl.paginationEl.addEventListener('click', handlePaginationClick);

refsMdl.galleryEl.addEventListener('click', handleGalleryClick);

// refsMdl.teamDescrEl.addEventListener('click', handleTeamDescrClick);

showPopular();
