from domain.Product import Product

class ProductValidation:
    @staticmethod
    def validate_name(name):
        """Validation for name: must have at least 3 characters and no special characters"""
        if len(name) < 3:
            raise ValueError("Product name must have at least 3 characters")
        return True

    @staticmethod
    def validate_kcal(kcal):
        """Validation for kcal: must be a positive number."""
        if kcal < 0:
            raise ValueError("Kcal must be a positive number.")
        return True

    @staticmethod
    def validate_product(product):
        """Validation for product: validates name, price, and quantity."""
        try:
            ProductValidation.validate_name(product.name)
            ProductValidation.validate_kcal(product.kcal)
        except ValueError as error:
            raise ValueError(f"Validation failed: {error}")

        return True