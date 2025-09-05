from extensions import db
from werkzeug.security import generate_password_hash, check_password_hash


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    weight = db.Column(db.Integer, nullable=False)

    allergies = db.Column(db.JSON, default=[])
    intolerances = db.Column(db.JSON, default=[])
    diseases = db.Column(db.JSON, default=[])

    def __init__(self, username, password, weight, allergies=None, intolerances=None, diseases=None):
        self.username = username
        self.password = generate_password_hash(password)
        self.weight = weight
        self.allergies = allergies or []
        self.intolerances = intolerances or []
        self.diseases = diseases or []

    def check_password(self, password):
        """Checks if the password is correct."""
        return check_password_hash(self.password, password)