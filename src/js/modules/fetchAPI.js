import axios from 'axios';
import { TMDB_KEY } from '../utils/envConsts';

const axiosTMDB = axios.create({
  baseURL: 'https://api.themoviedb.org/3/',
  params: {
    api_key: TMDB_KEY,
  },
});

const fetchPopular = async page => {
  const { data } = await axiosTMDB.get('trending/movie/week', { params: { page } });
  return data;
};

const fetchId = async movie_id => {
  const { data } = await axiosTMDB.get(`movie/${movie_id}`);
  return data;
};
const fetchSearch = async (query, page) => {
  const { data } = await axiosTMDB.get('search/movie', {
    params: { page, query, language: 'en-US', include_adult: false },
  });
  return data;
};

export default {
  fetchPopular,
  fetchSearch,
  fetchId,
};
