import axios from 'axios';
import { TMDB_KEY } from '../utils/envConsts';
import storageAPI from './storageAPI';
import { uiAPI } from './uiAPI';

export default class fetchAPI {
  constructor() {
    this.axiosTMDB = axios.create({
      baseURL: 'https://api.themoviedb.org/3/',
      params: {
        api_key: TMDB_KEY,
        include_adult: false,
      },
    });
    this.filterParams = {
      sort_by: 'popularity.desc',
      ['vote_count.gte']: 5,
    };
  }
  async fetchPopular(page) {
    uiAPI.showLoadingInfo();
    const { data } = await this.axiosTMDB.get('trending/movie/week', {
      params: { page, language: 'uk' },
    });
    uiAPI.hideLoadingInfo();
    return data;
  }
  async fetchId(movie_id) {
    uiAPI.showLoadingInfo();
    const arrFetch = [
      this.axiosTMDB.get(`movie/${movie_id}`, {
        params: { language: 'uk' },
      }),
      this.axiosTMDB.get(`movie/${movie_id}/videos`, {
        params: { language: 'en' },
      }),
    ];
    const arrResponse = await Promise.all(arrFetch);
    const { data } = arrResponse[0];
    data.videos = arrResponse[1].data?.results;
    uiAPI.hideLoadingInfo();
    return data;
  }

  async fetchSearch(query = '', page = 1) {
    uiAPI.showLoadingInfo();
    const { data } = await this.axiosTMDB.get('search/movie', {
      params: { page, query, language: 'uk' },
    });
    uiAPI.hideLoadingInfo();
    return data;
  }
  async fetchFiltered(page = 1) {
    uiAPI.showLoadingInfo();
    const filters = storageAPI.load('filters');
    filters.forEach(filter => {
      const [filterName, filterValue] = Object.entries(filter)[0];
      console.log(filterName);
      console.log(filterValue);
      this.filterParams[filterName] = filterValue;
    });
    console.log(this.filterParams);
    // console.log(filters);
    const { data } = await this.axiosTMDB.get('discover/movie', {
      params: { page, language: 'uk', ...this.filterParams },
    });
    uiAPI.hideLoadingInfo();
    return data;
  }
}

// const axiosTMDB = axios.create({
//   baseURL: 'https://api.themoviedb.org/3/',
//   params: {
//     api_key: TMDB_KEY,
//   },
// });

// const fetchPopular = async page => {
//   uiAPI.showLoadingInfo();
//   const { data } = await axiosTMDB.get('trending/movie/week', {
//     params: { page, language: 'uk', adult: false },
//   });
//   uiAPI.hideLoadingInfo();
//   return data;
// };

// const fetchId = async movie_id => {
//   uiAPI.showLoadingInfo();
//   const arrFetch = [
//     axiosTMDB.get(`movie/${movie_id}`, {
//       params: { language: 'uk' },
//     }),
//     axiosTMDB.get(`movie/${movie_id}/videos`, {
//       params: { language: 'en' },
//     }),
//   ];
//   const arrResponse = await Promise.all(arrFetch);
//   const { data } = arrResponse[0];
//   data.videos = arrResponse[1].data?.results;
//   uiAPI.hideLoadingInfo();
//   return data;
// };
// const fetchSearch = async (query, page) => {
//   uiAPI.showLoadingInfo();
//   const { data } = await axiosTMDB.get('search/movie', {
//     params: { page, query, language: 'uk', include_adult: false },
//   });
//   uiAPI.hideLoadingInfo();
//   return data;
// };

// export default {
//   fetchPopular,
//   fetchSearch,
//   fetchId,
// };
