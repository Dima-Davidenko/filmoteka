import { genresList } from '../utils/genresList';
import noImageUrl from '../../images/elementBackup/imageNotAvailable.jpg';

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
  let vote_average = 0;
  if (movieInfo?.vote_average) {
    vote_average = movieInfo.vote_average.toFixed(2);
  }
  const noImage = noImageUrl;
  return { title, posterUrl, genres, year, id, noImage, vote_average };
};

const prepareMoviesInfo = moviesArr => {
  return moviesArr.map(getOneMovieInfo);
};

const prepareModalCardInfo = movieInfo => {
  const id = movieInfo.id;
  let title = 'No Title';
  if (movieInfo?.title) {
    title = movieInfo.title;
  } else if (movieInfo.en?.title) {
    title = movieInfo.en.title;
  }
  const vote_average = movieInfo?.vote_average ? movieInfo.vote_average.toFixed(2) : '0';
  const vote_count = movieInfo?.vote_count || 'No Votes';
  const popularity = movieInfo?.popularity || 'No Rates';
  const genres = movieInfo?.genres.map(genre => genre.name).join(', ') || '';
  let original_title = 'No Title';
  if (movieInfo?.original_title) {
    original_title = movieInfo.original_title;
  } else if (movieInfo.en?.original_title) {
    original_title = movieInfo.en.original_title;
  }
  let overview = 'No overview';
  if (movieInfo?.overview) {
    overview = movieInfo.overview;
  } else if (movieInfo.en?.overview) {
    overview = movieInfo.en.overview;
  }
  let year = '';
  if (movieInfo?.release_date) {
    year = movieInfo.release_date?.length ? movieInfo?.release_date.slice(0, 4) : '';
  }
  const noImage = noImageUrl;
  let posterUrl = '';
  if (movieInfo?.poster_path) {
    posterUrl = `https://image.tmdb.org/t/p/w500${movieInfo.poster_path}`;
  } else if (movieInfo.en?.poster_path) {
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

export default {
  prepareMoviesInfo,
  prepareModalCardInfo,
};
