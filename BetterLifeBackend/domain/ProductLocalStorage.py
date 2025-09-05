class ProductLocalStorage:
    def __init__(self, name, barcode, prices, weight, kcal, id):

        self.id = id
        self.name = name
        self.barcode = barcode
        self.prices = prices
        self.weight = weight
        self.kcal = kcal

    def getKcal(self):
        return self.kcal

    def getName(self):
        return self.name

    def getBarcode(self):
        return self.barcode

    def getPrices(self):
        return self.prices

    def getWeight(self):
        return self.weight

    def getId(self):
        return self.id

    def getMinimumPrice(self):
        if not self.prices:
            return None, None
        minimum = None
        shops = []
        for sh, price in self.prices.items():
            if price is not None:
                if minimum is None or price < minimum:
                    minimum = price
                    shops = [sh]
                elif price == minimum:
                    shops.append(sh)
        if len(shops) > 0:
            return shops, minimum
        return None, None

    def display(self):
        print(f"Name: {self.name}")
        print(f"Barcode: {self.barcode}")
        print("Prices:")
        for shop, price in self.prices.items():
            print(f"  {shop}: {price}")
