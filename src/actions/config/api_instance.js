import axios from 'axios';

const fablab_api = axios.create({
	baseURL: process.env.REACT_APP_API_URL,
	headers: {'Accept': 'application/json'}
});

export default fablab_api;