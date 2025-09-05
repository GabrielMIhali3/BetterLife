from mysql.connector import Error

from domain.ProductLocalStorage import ProductLocalStorage
from Utils.ExtractPrice import ExtractPrice

class ProductLocalStorageRepository:
    _local_cache = {}

    def __init__(self, connection):
        self.extract_price = ExtractPrice()
        self.connection = connection
        self.refresh_local_cache()

    def refresh_local_cache(self):
        """Refresh local cache from MySQL"""
        new_cache = self.get_prices_for_all_products()
        self._local_cache = new_cache

    def get_local_cache(self):
        """Get local cache from MySQL"""
        return self._local_cache

    def execute_query(self, query):
        cursor = self.connection.cursor()
        try:
            cursor.execute(query)
            result = cursor.fetchall()
            return result
        except Error as e:
            print(f"Eroare la executarea interogării: {e}")
            return None

    def update_kcal(self):
        cursor = self.connection.cursor()

        # Extrage toate datele din tabel
        query = ("SELECT id, barcode, name, url FROM products as p JOIN prices as pr on pr.product_id = p.id where shop_id = 1")
        rows = self.execute_query(query)
        # Parcurge fiecare rând și actualizează valoarea kcal_100g
        for row in rows:
            id, barcode, name, url = row
            # url = f'https://ro.openfoodfacts.org/product/{barcode}'
            kcal_value = self.extract_price.extract_first_specification_value(url)
            print(name + ' ' + barcode + ' ' + kcal_value)
            if kcal_value:
                print(f'Updating id={id}, barcode={barcode}, name={name}, kcal_100g={kcal_value}')
                cursor.execute("UPDATE products SET kcal_100g = %s WHERE id = %s", (kcal_value, id))
                self.connection.commit()

        # Închide conexiunea la baza de date
        cursor.close()

    def update_weight(self):

        cursor = self.connection.cursor()

        # Extrage toate datele din tabel
        query = (
            "SELECT product_id, url FROM prices where shop_id = 1")
        rows = self.execute_query(query)
        # Parcurge fiecare rând și actualizează valoarea kcal_100g
        for row in rows:
            id, url = row
            # url = f'https://ro.openfoodfacts.org/product/{barcode}'
            weight = self.extract_price.extract_weight_from_url(url)
            # print(str(id) + ' ' + url)
            # print(weight)
            if weight:
                print(f'Updating id={id}, weight={weight}')
                cursor.execute("UPDATE products SET weight = %s WHERE id = %s", (weight, id))
                self.connection.commit()

        # Închide conexiunea la baza de date
        cursor.close()


    def getPrice(self, shop, url):
        if shop == 'Auchan':
            return self.extract_price.extract_price_auchan(url)
        elif shop == 'Profi':
            return self.extract_price.extract_price_profi_kaufland(url)
        elif shop == 'Kaufland':
            if 'tazz' in url:
                return self.extract_price.extract_price_profi_kaufland(url)
            else:
                return self.extract_price.extract_price_glovo(url)
        elif shop == 'Mega Image':
            return self.extract_price.extract_price_mega(url)
        elif shop == 'Carrefour':
            return self.extract_price.extract_price_carrefour(url)
        return -1

    def get_prices_for_all_products(self):

        # Interogare SQL pentru join între trei tabele
        sql_query = """
        SELECT p.name AS product_name, s.name AS shop_name, pr.url, p.barcode, p.weight, p.kcal_100g, p.id
        FROM prices pr
        JOIN products p ON p.id = pr.product_id
        JOIN shops s ON pr.shop_id = s.id;
        """

        list_of_all_products = {}

        # Executarea interogării și afișarea rezultatelor
        if self.connection:
            results = self.execute_query(sql_query)

            if results:
                for row in results:

                    price = None

                    if row[2] is not None:
                        try:
                            price = self.getPrice(row[1], row[2])
                            if price:
                                price = float(price)
                                print('name: ' + row[0] + ', shop: ' + row[1] + ', barcode: ' + row[3] + ', price: ' + str(price))
                            else:
                                print('name: ' + row[0] + ', shop: ' + row[1] + ', barcode: ' + row[3] + ', price: none')
                        except:
                            print(row[0] + ' nu are pret disponibil la magazinul: ' + row[1])
                    else:
                        print(row[0] + ' nu are pret disponibil la magazinul: ' + row[1])

                    if row[3] not in list_of_all_products:
                        product = ProductLocalStorage(row[0], row[3], {row[1]: price}, row[4], row[5], row[6])
                        list_of_all_products[row[3]] = product
                    else:
                        product = list_of_all_products[row[3]]
                        product.getPrices().update({row[1]: price})

        return list_of_all_products

    def close_connection(self):
        if self.connection.is_connected():
            self.connection.close()
            print("Conexiunea la MySQL a fost închisă.")
