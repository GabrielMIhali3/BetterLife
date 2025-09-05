import axios from 'axios'

var CONFIG = require('../utils/config.json');

const REST_API_BASE_URL = CONFIG.backendServerAddress + '/economy'

const REST_API_GET_TOTAL_ECONOMY = REST_API_BASE_URL + '/savings'

export const getTotalEconomy = (userId) => axios.get(REST_API_GET_TOTAL_ECONOMY + '/' + userId)