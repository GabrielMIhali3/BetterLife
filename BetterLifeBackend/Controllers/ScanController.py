from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
import os
from Services.ScanService import ScanService
from Utils.CalculateTimeToBurnCalories import calculate_time_to_burn_calories
from Utils.GetStoresLocation import GetStoresLocation
from domain.ProductLocalStorage import ProductLocalStorage


class ScanController:
    def __init__(self):
        self.ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
        self.scan_blueprint = Blueprint('scan', __name__, url_prefix='/scan')
        self._register_routes()
        self.locations = GetStoresLocation()


    def _register_routes(self):
        self.scan_blueprint.add_url_rule('/scan_barcode/<int:weightUser>', 'scan_barcode', self.scan_barcode, methods=['POST'])
        self.scan_blueprint.add_url_rule('/get_locations', 'get_locations', self.get_locations, methods=['POST'])

    def allowed_file(self, filename):
        return '.' in filename and filename.rsplit('.', 1)[1].lower() in self.ALLOWED_EXTENSIONS

    def scan_barcode(self, weightUser):
        file = request.files.get('img_barcode')
        if not file:
            return jsonify({'error': 'No file part'}), 400

        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400

        productLocalStorage = None
        if file and self.allowed_file(file.filename):
            filename = secure_filename(file.filename)
            upload_folder = current_app.config['UPLOAD_FOLDER']
            filepath = os.path.join(upload_folder, filename)
            file.save(filepath)

            productLocalStorage = ScanService.scan(filepath)
            # productLocalStorage = ScanService.scan('C:\\info\\levelup\\BetterLifeBackend\\uploads\\Imagine_WhatsApp_2025-02-26_la_20.34.47_57f6dc07.jpg')

            if productLocalStorage is None:
                return jsonify({'error': 'Barcode not found!'}), 404

        return jsonify({
            'id': productLocalStorage.getId(),
            'name': productLocalStorage.getName(),
            'barcode': productLocalStorage.getBarcode(),
            'weight': productLocalStorage.getWeight(),
            'prices': {shop: price for shop, price in productLocalStorage.getPrices().items() if price is not None},
            'kcal': productLocalStorage.getKcal(),
            'prices_min': productLocalStorage.getMinimumPrice(),
            'calculate_time_to_burn_calories': calculate_time_to_burn_calories(weightUser, productLocalStorage.getKcal(), productLocalStorage.getWeight())
        }), 200

    def get_locations(self):
        try:
            data = request.get_json()
            print(data)
            current_coordinates = data.get('current_coordinates')
            store_names = data.get('stores')
            result = self.locations.get_nearest_store(current_coordinates, store_names)
            return jsonify(result)

        except Exception as e:
            print(e)
            return jsonify({"error": str(e)}), 400
