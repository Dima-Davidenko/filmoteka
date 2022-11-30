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
  const { data } = await axiosTMDB.get('trending/movie/week', {
    params: { page, language: 'uk' },
  });
  uiAPI.hideLoadingInfo();
  return data;
};

const fetchId = async movie_id => {
  uiAPI.showLoadingInfo();
  const arrFetch = [
    axiosTMDB.get(`movie/${movie_id}`, {
      params: { language: 'uk' },
    }),
    axiosTMDB.get(`movie/${movie_id}/videos`, {
      params: { language: 'en' },
    }),
  ];
  const arrResponse = await Promise.all(arrFetch);
  const { data } = arrResponse[0];
  data.videos = arrResponse[1].data?.results;
  uiAPI.hideLoadingInfo();
  return data;
};
const fetchSearch = async (query, page) => {
  uiAPI.showLoadingInfo();
  const { data } = await axiosTMDB.get('search/movie', {
    params: { page, query, language: 'uk', include_adult: false },
  });
  uiAPI.hideLoadingInfo();
  return data;
};

export default {
  fetchPopular,
  fetchSearch,
  fetchId,
};
