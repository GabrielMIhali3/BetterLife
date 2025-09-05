from domain.Product import Product
from extensions import db

class ProductRepository:
    @staticmethod
    def add_product(product):
        """Adds a product to the database"""
        try:
            db.session.add(product)
            db.session.commit()
            return product
        except Exception as e:
            db.session.rollback()
            raise Exception(f"Error adding user: {e}")

    @staticmethod
    def get_by_id(product_id):
        """Gets a product by its id"""
        return Product.query.filter_by(id=product_id).first()

    @staticmethod
    def get_by_name(name):
        """Gets a product by its name"""
        return Product.query.filter_by(name=name).first()

    @staticmethod
    def get_all():
        """Gets all products from the database"""
        return Product.query.all()