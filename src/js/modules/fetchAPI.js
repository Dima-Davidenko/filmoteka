import axios from 'axios';
import { TMDB_KEY } from '../utils/envConsts';
import { uiAPI } from './uiAPI';

const axiosTMDB = axios.create({
  baseURL: 'https://api.themoviedb.org/3/',
  params: {
    api_key: TMDB_KEY,
  },
});

const fetchPopular = async page => {
  uiAPI.showLoadingInfo();
  const { data } = await axiosTMDB.get('trending/movie/week', { params: { page } });
  uiAPI.hideLoadingInfo();
  return data;
};

const fetchId = async movie_id => {
  uiAPI.showLoadingInfo();
  const { data } = await axiosTMDB.get(`movie/${movie_id}`, { params: { language: 'en-US' } });
  uiAPI.hideLoadingInfo();
  return data;
};
const fetchSearch = async (query, page) => {
  uiAPI.showLoadingInfo();
  const { data } = await axiosTMDB.get('search/movie', {
    params: { page, query, language: 'en-US', include_adult: false },
  });
  uiAPI.hideLoadingInfo();
  return data;
};

export default {
  fetchPopular,
  fetchSearch,
  fetchId,
};
