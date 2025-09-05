from datetime import datetime

from flask import Blueprint, request, jsonify
from Services.ScanHistoryService import ScanHistoryService
from DTO.ScanHistoryDTO import ScanHistoryDTO

class ScanHistoryController:
    def __init__(self):
        self.scan_history_blueprint = Blueprint('scanHistory', __name__, url_prefix='/scanHistory')
        self._register_routes()

    def _register_routes(self):
        self.scan_history_blueprint.add_url_rule('/getAllByUserId/<int:user_id>', 'get_all_by_user_id', self.get_all_by_user_id, methods=['GET'])
        self.scan_history_blueprint.add_url_rule('/getById/<int:scan_id>', 'get_by_id', self.get_by_id, methods=['GET'])
        self.scan_history_blueprint.add_url_rule('/createScanHistory', 'create_scanHistory', self.create_scanHistory, methods=['POST'])

    def create_scanHistory(self):
        try:
            data = request.get_json()
            if 'user_id' not in data or 'product_id' not in data or 'product_id' not in data or 'purchased' not in data or 'price' not in data:
                return jsonify({"error": "Missing required fields: user_id, product_id, product_id, purchased, price"}), 400

            scanHistoryDTO = ScanHistoryDTO(None,
                                            user_id=data['user_id'],
                                            product_id=data['product_id'],
                                            scanned_at=datetime.fromisoformat(
                                                data['scanned_at'].replace('Z', '+00:00')),
                                            purchased=data['purchased'],
                                            price=data['price']
                            )
            scanHistory_saved = ScanHistoryService.add_scanHistory(scanHistoryDTO)
            return jsonify(scanHistory_saved.to_dict()), 201
        except Exception as e:
            print(e)
            return jsonify({'error': str(e)}), 400

    def get_all_by_user_id(self, user_id: int):
        """Gets all scan history by user id"""
        try:
            scan_histories = ScanHistoryService.get_all_by_user_id(user_id)
            return jsonify([scan_history.to_dict() for scan_history in scan_histories]), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 400

    def get_by_id(self, scan_id: int):
        """Gets scan history by id"""
        try:
            scan_history = ScanHistoryService.get_by_id(scan_id)
            if scan_history is None:
                return jsonify({'message': 'Product not found'}), 404

            return jsonify(scan_history.to_dict()), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 400
