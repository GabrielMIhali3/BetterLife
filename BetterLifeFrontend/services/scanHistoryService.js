import axios from 'axios'

var CONFIG = require('../utils/config.json');

const REST_API_BASE_URL = CONFIG.backendServerAddress + '/scanHistory'

const REST_API_CREATE_SCAN_HISTORY = REST_API_BASE_URL + '/history';

const REST_API_GET_SCAN_HISTORY = REST_API_BASE_URL + '/history';

export const createScanHistory = (scanHistory) => axios.post(REST_API_CREATE_SCAN_HISTORY, scanHistory);

export const getScanHistory = (userId) => axios.get(REST_API_GET_SCAN_HISTORY+'/'+userId);