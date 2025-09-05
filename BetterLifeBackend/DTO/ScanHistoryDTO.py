class ScanHistoryDTO:
    def __init__(self, scanHistory_id, user_id, product_id, scanned_at, purchased, price):
        self._id = scanHistory_id
        self._user_id = user_id
        self._product_id = product_id
        self._scanned_at = scanned_at
        self._purchased = purchased
        self._price = price

    @property
    def id(self):
        return self._id
    @id.setter
    def id(self, value):
        self._id = value

    @property
    def user_id(self):
        return self._user_id
    @user_id.setter
    def user_id(self, value):
        self._user_id = value

    @property
    def product_id(self):
        return self._product_id
    @product_id.setter
    def product_id(self, value):
        self._product_id = value

    @property
    def scanned_at(self):
        return self._scanned_at
    @scanned_at.setter
    def scanned_at(self, value):
        self._scanned_at = value

    @property
    def purchased(self):
        return self._purchased
    @purchased.setter
    def purchased(self, value):
        self._purchased = value

    @property
    def price(self):
        return self._price
    @price.setter
    def price(self, value):
        self._price = value

    def to_dict(self):
        return {"id": self._id, "user_id": self._user_id, "product_id": self._product_id, "scanned_at": self._scanned_at, "purchased": self._purchased, "price": self._price}