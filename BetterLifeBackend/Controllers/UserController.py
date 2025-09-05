from flask import Blueprint, request, jsonify
from Services.UserService import UserService
from DTO.UserDTO import UserDTO


class UserController:
    def __init__(self):
        self.user_blueprint = Blueprint('user', __name__, url_prefix='/user')
        self._register_routes()

    def _register_routes(self):
        self.user_blueprint.add_url_rule('/users', 'createUser', self.create_user, methods=['POST'])
        self.user_blueprint.add_url_rule('/login', 'login', self.login, methods=['POST'])
        self.user_blueprint.add_url_rule('/getById/<int:user_id>', 'get_by_id', self.get_by_id, methods=['GET'])

    def create_user(self):
        try:
            data = request.get_json()
            if 'username' not in data or 'password' not in data or 'weight' not in data:
                return jsonify({"error": "Missing required fields: username, password, weight"}), 400

            allergies = []
            if 'allergies' in data:
                allergies = data['allergies']
            intolerances = []
            if 'intolerances' in data:
                intolerances = data['intolerances']
            diseases = []
            if 'diseases' in data:
                diseases = data['diseases']

            user_dto = UserDTO(
                id=None,
                username=data['username'],
                weight=data['weight'],
                allergies=allergies,
                intolerances=intolerances,
                diseases=diseases
            )
            password = data['password']
            user_saved = UserService.add_user(user_dto, password)
            return jsonify(user_saved.to_dict()), 201
        except Exception as e:
            return jsonify({'error': str(e)}), 400

    def login(self):
        try:
            data = request.get_json()
            if 'username' not in data or 'password' not in data:
                return jsonify({"error": "Missing required fields: username, password"}), 400

            username = data['username']
            password = data['password']

            user_dto = UserService.login_user(username, password)
            return jsonify(user_dto.to_dict()), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 404

    def get_by_id(self, user_id):
        """Gets a user by id"""
        try:
            user = UserService.get_by_id(user_id)

            if user is None:
                return jsonify({'message': 'User not found'}), 404

            return jsonify(user.to_dict()), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 400