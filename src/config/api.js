import axios from 'axios';
import { serverApi } from './constrant';

const api = axios.create({
	baseURL: serverApi,
	withCredentials: true,
	headers: {
		'Access-Control-Allow-Origin': '*',
	},
});

export default api;
