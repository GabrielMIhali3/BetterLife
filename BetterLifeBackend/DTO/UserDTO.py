class UserDTO:
    def __init__(self, id, username, weight, allergies=None, intolerances=None, diseases=None):
        self._id = id
        self._username = username
        self._weight = weight
        self._allergies = allergies or []
        self._intolerances = intolerances or []
        self._diseases = diseases or []

    @property
    def id(self):
        return self._id
    @id.setter
    def id(self, value):
        self._id = value

    @property
    def username(self):
        return self._username
    @username.setter
    def username(self, value):
        self._username = value

    @property
    def weight(self):
        return self._weight
    @weight.setter
    def weight(self, value):
        self._weight = value

    @property
    def allergies(self):
        return self._allergies
    @allergies.setter
    def allergies(self, value):
        self._allergies = value

    @property
    def intolerances(self):
        return self._intolerances
    @intolerances.setter
    def intolerances(self, value):
        self._intolerances = value

    @property
    def diseases(self):
        return self._diseases
    @diseases.setter
    def diseases(self, value):
        self._diseases = value

    def to_dict(self):
        return {"id": self.id, "username": self.username, "weight": self.weight, "allergies": self.allergies, "intolerances": self.intolerances, "diseases": self.diseases}
