from flask import Blueprint, request, jsonify

from Services.ChatBotService import ChatBotService


class ChatBotController:
    def __init__(self):
        self.__chatBotService = ChatBotService()
        self.chatBot_blueprint = Blueprint('chatBot', __name__, url_prefix='/chatBot')
        self._register_routes()

    def _register_routes(self):
        self.chatBot_blueprint.add_url_rule('/askChatBot', 'ask_chat_bot', self.ask_chat_bot, methods=['POST'])
        self.chatBot_blueprint.add_url_rule('/askChatBotAfterScan/<int:user_id>/<int:product_id>', 'ask_chat_bot_after_scan', self.ask_chat_bot_after_scan, methods=['GET'])

    def ask_chat_bot(self):
        try:
            data = request.get_json()
            if 'prompt' not in data:
                return jsonify({"error": "Missing required field"}), 400

            prompt = data['prompt']

            response = self.__chatBotService.ask_chat_bot(prompt)
            return jsonify({'response': response}), 200
        except MemoryError as e:
            return jsonify({'error': str(e)}), 404

    def ask_chat_bot_after_scan(self, user_id: int, product_id: int):
        try:
            response = self.__chatBotService.ask_chat_bot_after_scan(user_id, product_id)
            return jsonify({'response': response}), 200
        except MemoryError as e:
            return jsonify({'memoryError': str(e)}), 404
        except ValueError as e:
            return jsonify({'error': str(e)}), 404