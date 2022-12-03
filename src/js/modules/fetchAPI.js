import axios from 'axios';
import { TMDB_KEY } from '../utils/envConsts';
import storageAPI from './storageAPI';
import { uiAPI } from './uiAPI';
import firebaseAPI from './firebaseAPI';

class fetchTMDBAPI {
  constructor() {
    this.axiosTMDB = axios.create({
      baseURL: 'https://api.themoviedb.org/3/',
      params: {
        api_key: TMDB_KEY,
        include_adult: false,
      },
    });
    this.filterParams = {
      sort_by: 'vote_average.desc',
      ['vote_count.gte']: 10,
    };
  }
  async fetchPopular(page = 1) {
    uiAPI.showLoadingInfo();
    const arrFetch = [
      this.axiosTMDB.get('trending/movie/week', {
        params: { page, language: 'uk' },
      }),
      this.axiosTMDB.get('trending/movie/week', {
        params: { page, language: 'en' },
      }),
    ];
    const arrResponse = await Promise.all(arrFetch);
    const { data } = arrResponse[0];
    data.en = arrResponse[1].data;
    uiAPI.hideLoadingInfo();
    return data;
  }
  async fetchId(movie_id) {
    uiAPI.showLoadingInfo();
    const arrFetch = [
      this.axiosTMDB.get(`movie/${movie_id}`, {
        params: { language: 'uk' },
      }),
      this.axiosTMDB.get(`movie/${movie_id}`, {
        params: { language: 'en' },
      }),
      this.axiosTMDB.get(`movie/${movie_id}/videos`, {
        params: { language: 'en' },
      }),
    ];
    const arrResponse = await Promise.all(arrFetch);
    const { data } = arrResponse[0];
    data.en = arrResponse[1].data;
    data.videos = arrResponse[2].data?.results;
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
      this.filterParams[filterName] = filterValue;
    });
    console.log(this.filterParams);
    const { data } = await this.axiosTMDB.get('discover/movie', {
      params: { page, language: 'uk', ...this.filterParams },
    });
    uiAPI.hideLoadingInfo();
    return data;
  }
}

class fetchYT {
  constructor() {
    this.axiosTMDB = axios.create({
      baseURL: 'https://www.googleapis.com/youtube/v3/search',
      params: {
        part: 'snippet',
        type: 'video',
      },
    });
  }
  async fetchYTSearch(q) {
    const { data } = await this.axiosTMDB.get('', {
      params: { q, key: firebaseAPI.instance.apiKey },
    });
    return data;
  }
}

const instance = new fetchTMDBAPI();
const instanceYT = new fetchYT();

export default {
  instance,
  instanceYT,
};
