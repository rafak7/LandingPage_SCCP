import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://api.api-futebol.com.br/v1',
  headers: {
    'Authorization': `Bearer live_2d128aee9853eda80ea32f84798a38`
  }
});