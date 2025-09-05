from extensions import db

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), unique=True, nullable=False)
    kcal = db.Column(db.Integer, nullable=False)
    weight = db.Column(db.Float, nullable=False)

    def __init__(self, name, kcal, weight):
        self.name = name
        self.kcal = kcal
        self.weight = weight