import axios from 'axios'

var CONFIG = require('../utils/config.json');

const REST_API_BASE_URL = CONFIG.backendServerAddress + '/chatBot'

const REST_API_ASK_CHATBOT = REST_API_BASE_URL + '/chat_bot'

export const askChatBot = (prompt) => axios.post(REST_API_ASK_CHATBOT, prompt);

export const askChatBotAfterScan = (userId, productId) => axios.get(REST_API_ASK_CHATBOT + '/' + userId + '/' + productId);