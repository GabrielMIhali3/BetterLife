class ProductDTO:
    def __init__(self, id, name, kcal, weight):
        self._id = id
        self._name = name
        self._kcal = kcal
        self._weight = weight

    @property
    def id(self):
        return self._id
    @id.setter
    def id(self, value):
        self._id = value

    @property
    def name(self):
        return self._name
    @name.setter
    def name(self, value):
        self._name = value

    @property
    def kcal(self):
        return self._kcal
    @kcal.setter
    def kcal(self, value):
        self._kcal = value

    @property
    def weight(self):
        return self._weight
    @weight.setter
    def weight(self, value):
        self._weight = value

    def to_dict(self):
        return {"id": self.id, "name": self.name, "kcal": self.kcal, "weight": self.weight}