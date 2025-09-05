import cv2
from pyzbar.pyzbar import decode

def extract_barcode(image_path) -> str | None:
    image = cv2.imread(image_path)
    barcodes = decode(image)

    for barcode in barcodes:
        barcode_data = barcode.data.decode("utf-8")
        barcode_type = barcode.type
        return barcode_data
