from DTO.ProductDTO import ProductDTO
from domain.Product import Product

class ProductMapper:
    @staticmethod
    def mapToProductDTO(product: Product) -> ProductDTO:
        """Maps a Product entity to a ProductDTO"""
        return ProductDTO(product.id, product.name, product.kcal, product.weight)

    @staticmethod
    def mapToProduct(product_dto: ProductDTO) -> Product:
        """Maps a ProductDTO to a Product"""
        product = Product(product_dto.name, product_dto.kcal, product_dto.weight)
        product.id = product_dto.id
        return product
    