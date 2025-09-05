import axios from 'axios'

var CONFIG = require('../utils/config.json');

const REST_API_BASE_URL = CONFIG.backendServerAddress + '/user'

const REST_API_REGISTER_URL = REST_API_BASE_URL + '/users'

const REST_API_LOGIN_URL = REST_API_BASE_URL + '/login'

export const createUser = (user) => axios.post(REST_API_REGISTER_URL, user);

export const loginUser = (loginRequest) => axios.post(REST_API_LOGIN_URL, loginRequest);