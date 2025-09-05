from datetime import datetime

from extensions import db

class ScanHistory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    scanned_at = db.Column(db.DateTime, default=datetime.now)
    purchased = db.Column(db.Boolean, nullable=False, default=False)
    price = db.Column(db.Float, nullable=False)

    def __init__(self, user_id, product_id, scanned_at=None, purchased=False, price=0):
        self.user_id = user_id
        self.product_id = product_id
        self.scanned_at = scanned_at or datetime.now()
        self.purchased = purchased
        self.price = price