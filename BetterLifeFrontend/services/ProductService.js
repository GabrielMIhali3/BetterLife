import axios from 'axios';

var CONFIG = require('../utils/config.json');

const REST_API_BASE_URL = CONFIG.backendServerAddress + '/product'

const REST_API_FIND_BY_NAME = REST_API_BASE_URL + '/products';

const REST_API_CREATE_PRODUCT = REST_API_BASE_URL + '/products';

const REST_API_GET_PRODUCT = REST_API_BASE_URL + '/products'

export const findProductByName = (name) => axios.get(REST_API_FIND_BY_NAME + '/' + name);

export const createProduct = (product) => axios.post(REST_API_CREATE_PRODUCT, product);

export const getProductData = (product_id) => axios.get(REST_API_GET_PRODUCT + '/' + product_id);