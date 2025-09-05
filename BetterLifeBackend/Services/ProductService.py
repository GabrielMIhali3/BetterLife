from DTO.ProductDTO import ProductDTO
from Repositories.ProductRepository import ProductRepository
from Validation.ProductValidation import ProductValidation
from domain.Product import Product
from Mapper.ProductMapper import ProductMapper

class ProductService:
    @staticmethod
    def add_product(product_dto) -> ProductDTO:
        """Adds a product to the database"""
        try:
            product = ProductMapper.mapToProduct(product_dto)

            if ProductRepository.get_by_name(product.name) is not None:
                raise ValueError('Product already exists!')

            ProductValidation.validate_product(product)
            return ProductMapper.mapToProductDTO(ProductRepository.add_product(product))
        except Exception as e:
            raise RuntimeError(e)

    @staticmethod
    def get_by_name(name: str) -> ProductDTO | None:
        """Gets a product by its name"""
        product = ProductRepository.get_by_name(name)
        if product is None:
            return None
        return ProductMapper.mapToProductDTO(product)

    @staticmethod
    def get_by_id(product_id) -> ProductDTO | None:
        """Gets a product by its id"""
        product = ProductRepository.get_by_id(product_id)
        if product is None:
            return None
        return ProductMapper.mapToProductDTO(product)