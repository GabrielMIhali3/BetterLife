from Utils.image_processing import extract_barcode
from domain.ProductLocalStorage import ProductLocalStorage
from extensions import productLocalStorageRepository

class ScanService:
    @staticmethod
    def scan(image_path) -> ProductLocalStorage | None:
        """Take barcode and extract information this product"""
        barcode = extract_barcode(image_path)

        if barcode is None:
            print("Barcode not found!")
            return None

        if barcode not in productLocalStorageRepository.get_local_cache():
            print('Barcode not found in local cache!')
            return None

        return productLocalStorageRepository.get_local_cache()[barcode]

