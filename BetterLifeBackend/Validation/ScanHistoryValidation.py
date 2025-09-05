from domain.ScanHistory import ScanHistory

class ScanHistoryValidation:
    @staticmethod
    def validate_user_id(user_id):
        """Validates user ID: must be positive number"""
        if user_id < 1:
            raise ValueError("User ID must be positive")
        return True

    @staticmethod
    def validate_product_id(product_id):
        """Validates product ID: must be positive number"""
        if product_id < 1:
            raise ValueError("Product ID must be positive")
        return True

    @staticmethod
    def validate_price(price):
        """Validation for price: must be a positive number."""
        if price < 0:
            raise ValueError("Price must be a positive number.")
        return True

    @staticmethod
    def validate_ScanHistory(scanHistory):
        """Validates scan history: user_id, product_id"""
        try:
            ScanHistoryValidation.validate_user_id(scanHistory.user_id)
            ScanHistoryValidation.validate_product_id(scanHistory.product_id)
            ScanHistoryValidation.validate_price(scanHistory.price)
        except ValueError as e:
            raise ValueError(f"Validation failed: {e}")

        return True
