import re
from domain.User import User

class UserValidation:
    ALLOWED_ALLERGIES = {
        "Peanut allergy", "Tree nut allergy", "Milk allergy", "Egg allergy",
        "Soy allergy", "Wheat allergy", "Sesame allergy"
    }

    ALLOWED_INTOLERANCES = {
        "Lactose intolerance", "Gluten intolerance", "Fructose intolerance"
    }
    
    ALLOWED_DISEASES = {
        "Diabetes", "Hypertension", "High cholesterol", "Kidney disease",
        "Gout", "Gastroesophageal reflux disease"
    }

    @staticmethod
    def validate_username(username):
        """Validation for username: must have at least 4 characters and no special characters."""
        if len(username) < 4:
            raise ValueError("Username must have at least 4 characters.")
        if not username.isalnum():
            raise ValueError("Username can contain only alphanumeric characters.")
        return True

    @staticmethod
    def validate_password(password):
        """Validation for password: must be at least 8 characters, with at least one lowercase letter, one uppercase letter, one number, and one special character."""
        if len(password) < 8:
            raise ValueError("Password must have at least 8 characters.")
        if not re.search("[a-z]", password):
            raise ValueError("Password must contain at least one lowercase letter.")
        if not re.search("[A-Z]", password):
            raise ValueError("Password must contain at least one uppercase letter.")
        if not re.search("[0-9]", password):
            raise ValueError("Password must contain at least one number.")
        if not re.search("[!@#$%^&*(),.?\":{}|<>]", password):
            raise ValueError("Password must contain at least one special character.")
        return True

    @staticmethod
    def validate_weight(weight):
        """Validation for weight: must be between 1 and 300."""
        if weight < 1 or weight > 300:
            raise ValueError("Weight must be between 1 and 300.")
        return True

    @staticmethod
    def validate_allergies(allergies):
        invalid_allergies = set(allergies) - UserValidation.ALLOWED_ALLERGIES

        if invalid_allergies:
            raise ValueError(f"Invalid allergies: {list(invalid_allergies)}")
        return True

    @staticmethod
    def validate_intolerances(intolerances):
        invalid_intolerances = set(intolerances) - UserValidation.ALLOWED_INTOLERANCES
        if invalid_intolerances:
            raise ValueError(f"Invalid intolerances: {list(invalid_intolerances)}")
        return True

    @staticmethod
    def validate_diseases(diseases):
        invalid_diseases = set(diseases) - UserValidation.ALLOWED_DISEASES
        if invalid_diseases:
            raise ValueError(f"Invalid diseases: {list(invalid_diseases)}")
        return True

    @staticmethod
    def validate_user(user):
        """Validate user"""
        try:
            UserValidation.validate_username(user.username)
            UserValidation.validate_password(user.password)
            UserValidation.validate_weight(user.weight)
            UserValidation.validate_allergies(user.allergies)
            UserValidation.validate_intolerances(user.intolerances)
            UserValidation.validate_diseases(user.diseases)
        except ValueError as error:
            raise ValueError(f"Validation failed: {error}")

        return True