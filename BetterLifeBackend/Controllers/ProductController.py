from flask import Blueprint, request, jsonify
from Services.ProductService import ProductService
from DTO.ProductDTO import ProductDTO


class ProductController:
    def __init__(self):
        self.product_blueprint = Blueprint('product', __name__, url_prefix='/product')
        self._register_routes()

    def _register_routes(self):
        self.product_blueprint.add_url_rule('/getById/<int:id_product>', 'get_by_id', self.get_by_id, methods=['GET'])
        self.product_blueprint.add_url_rule('/createProduct', 'create_product', self.create_product, methods=['POST'])
        self.product_blueprint.add_url_rule('/getByName/<string:name_product>', 'get_by_name', self.get_by_name, methods=['GET'])

    def create_product(self):
        try:
            data = request.get_json()
            if 'name' not in data or 'kcal' not in data or 'weight' not in data:
                return jsonify({"error": "Missing required fields: name, kcal, weight"}), 400

            product_dto = ProductDTO(id=None, name=data['name'], kcal=data['kcal'], weight=data['weight'])

            product_saved = ProductService.add_product(product_dto)
            return jsonify(product_saved.to_dict()), 201
        except Exception as e:
            return jsonify({"error": str(e)}), 400

    def get_by_name(self, name_product):
        try:
            product = ProductService.get_by_name(name_product)
            if product is None:
                return jsonify({"error": "Product not found"}), 404

            return jsonify(product.to_dict()), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 400

    def get_by_id(self, id_product):
        try:
            product = ProductService.get_by_id(id_product)

            if product is None:
                return jsonify({'message': 'Product not found'}), 404

            return jsonify(product.to_dict()), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 400