import axios from 'axios'

var CONFIG = require('../utils/config.json');

const REST_API_BASE_URL = CONFIG.backendServerAddress + '/scan'

const REST_API_SCAN_BARCODE = REST_API_BASE_URL + '/barcode'

const REST_API_GET_LOCATIONS = REST_API_BASE_URL + '/locations'
export const scanBarCode =(weight, formData) => axios.post(REST_API_SCAN_BARCODE+'/'+weight,formData,
{
    headers: {
        'Content-Type': 'multipart/form-data',
      }
})

export const getTotalEconomy = (userId) => axios.get(REST_API_GET_TOTAL_ECONOMY+userId)

export const getLocations = (coords) => axios.post(REST_API_GET_LOCATIONS, coords)