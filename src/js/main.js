import refsMdl from './modules/refsMdl';
import fetchAPI from './modules/fetchAPI';
import storageAPI from './modules/storageAPI';
import { genresList } from './utils/genresList';
import { uiAPI } from './modules/uiAPI';
import { APP_STATES, POPULAR_STORAGE_KEY } from './utils/constsMdl';
import { SEARCH_INPUT_NAME } from './utils/constsMdl';
import firebaseAPI from './modules/firebaseAPI';
import storageAPI from './modules/storageAPI';

const currentAppState = {
  galleryState: 'popular',
  headerState: 'main',
  searchQuery: '',
  popular: { currentPage: 1, totalPages: null },
  search: { currentPage: 1, totalPages: null },
  watched: { currentPage: 1, totalPages: null },
  queued: { currentPage: 1, totalPages: null },
};

const firebaseInstance = new firebaseAPI(refsMdl.signInBtnEl, refsMdl.logoutBtnEl);

const changeAppState = type => {
  uiAPI.state.type = type;
};

const getOneMovieInfo = movieInfo => {
  const filmId = movieInfo.id;
  const movieName = movieInfo.title;
  const posterUrl = `https://image.tmdb.org/t/p/w500${movieInfo.poster_path}`;
  const genres = movieInfo.genre_ids.map(genreId => genresList[genreId]);
  const year = movieInfo.release_date.slice(0, 4);
  return { movieName, posterUrl, genres, year, filmId };
};

const prepareMoviesInfo = moviesArr => {
  return moviesArr.map(getOneMovieInfo);
};

const showPopular = async () => {
  try {
    const response = await fetchAPI.fetchPopular(currentAppState.popular.currentPage);
    currentAppState.popular.totalPages = response.total_pages;
    console.log(response);
    const processedInfo = prepareMoviesInfo(response.results);
    uiAPI.renderGallery(processedInfo);
  } catch (error) {
    console.log(error.message);
    // Notify.failure(error.message);
  }
};

const handleHomeBtnClick = async e => {
  // uiAPI.setActiveBtn(e.target);
  if (currentAppState.headerState !== 'main') uiAPI.renderMainHeader();
  currentAppState.popular.currentPage = 1;
  currentAppState.galleryState = 'popular';
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
  } catch (error) {
    console.log(error.message);
    // Notify.failure(error.message);
  }
};

const handleFormSubmit = async event => {
  event.preventDefault();
  currentAppState.searchQuery = event.target.elements[SEARCH_INPUT_NAME].value.trim();
  if (!currentAppState.searchQuery) return;
  currentAppState.search.currentPage = 1;
  currentAppState.galleryState = 'search';
  showSearch();
};

const showWatched = async () => {
  const storageWatchedList = storageAPI.load('lybrary');
  const preparedWatchedList = Object.values(storageWatchedList.watched);
  uiAPI.renderGallery(preparedWatchedList);
};

const handleLybraryBtnClick = async e => {
  uiAPI.setActiveBtn(e.target);
  if (currentAppState.headerState !== 'lyb') {
    uiAPI.renderLybHeader();
  } else {
    return;
  }
  currentAppState.watched.currentPage = 1;
  currentAppState.galleryState = 'watched';
  showWatched();
};

const handleWatchedBtnClick = () => {};
const handleAddToWatchedBtnClick = async () => {};

const handleQueuedBtnClick = () => {};
const handleAddToQueuedBtnClick = async () => {};

const handlePaginationClick = () => {};

const handleGalleryClick = async () => {};

const handleTeamDescrClick = () => {};

refsMdl.logoEl.addEventListener('click', handleHomeBtnClick);
refsMdl.homeBtnEl.addEventListener('click', handleHomeBtnClick);

refsMdl.searchFormEl.addEventListener('submit', handleFormSubmit);

refsMdl.lybraryBtnEl.addEventListener('click', handleLybraryBtnClick);

refsMdl.watchedBtnEl.addEventListener('click', handleWatchedBtnClick);
refsMdl.queuedBtnEl.addEventListener('click', handleQueuedBtnClick);

refsMdl.addToWatchedBtnEl.addEventListener('click', handleAddToWatchedBtnClick);
refsMdl.addToQueuedBtnEl.addEventListener('click', handleAddToQueuedBtnClick);

refsMdl.paginationEl.addEventListener('click', handlePaginationClick);

refsMdl.galleryEl.addEventListener('click', handleGalleryClick);

refsMdl.teamDescrEl.addEventListener('click', handleTeamDescrClick);
