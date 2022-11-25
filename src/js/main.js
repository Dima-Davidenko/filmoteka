import refsMdl from './modules/refsMdl';
import fetchAPI from './modules/fetchAPI';
import storageAPI from './modules/storageAPI';
import { genresList } from './utils/genresList';
import { uiAPI } from './modules/uiAPI';
import { APP_STATES } from './utils/constsMdl';
import { SEARCH_INPUT_NAME } from './utils/constsMdl';
import firebaseAPI from './modules/firebaseAPI';

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

const handleHomeBtnClick = async () => {
  changeAppState(APP_STATES.POPULAR);
  uiAPI.state.popular.currentPage = 1;
  try {
    const response = await fetchAPI.fetchPopular(uiAPI.state.popular.currentPage);
    uiAPI.state.popular.totalPages = response.total_pages;
    console.log(response);
    const processedInfo = prepareMoviesInfo(response.results);
    uiAPI.renderList(processedInfo);
    uiAPI.renderHeader();
  } catch (error) {
    console.log(error.message);
    // Notify.failure(error.message);
  }
};

const handleFormSubmit = async event => {
  event.preventDefault();
  const inputValue = event.target.elements[SEARCH_INPUT_NAME].value.trim();
  if (inputValue === '') return;
  changeAppState(APP_STATES.SEARCHED);
  uiAPI.state.searched.currentPage = 1;
  try {
    const response = await fetchAPI.fetchSearch(inputValue, uiAPI.state.searched.currentPage);
    console.log(response);
    const processedInfo = prepareMoviesInfo(response.results);
    // await firebaseInstance.writeToDB(processedInfo[0]);
    await firebaseInstance.removeFromWatched(processedInfo[0].filmId);
    console.log(processedInfo);

    uiAPI.renderList(processedInfo);
    uiAPI.renderHeader();
  } catch (error) {
    console.log(error.message);
    // Notify.failure(error.message);
  }
};

const handleLybraryBtnClick = async () => {};

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
