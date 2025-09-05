from Repositories.ScanHistoryRepository import ScanHistoryRepository
from Services.ProductService import ProductService
from domain.Product import Product


class EconomyService:
    @staticmethod
    def get_economy_by_month_and_user_id(month:int, user_id: int) -> tuple[int, int]:
        money, kcal = 0, 0
        scanHistories = ScanHistoryRepository.get_all_by_month_and_user_id(month, user_id)
        if not scanHistories:
            return 0, 0
        for scanHistory in scanHistories:
            if scanHistory.purchased is False:
                money += scanHistory.price
                kcal += ProductService.get_by_id(scanHistory.product_id).kcal
        return money, kcal

    @classmethod
    def get_economy_by_user_id(cls, user_id):
        money, kcal = [0]*12, [0]*12
        scanHistories = ScanHistoryRepository.get_all_by_user_id(user_id)
        for scanHistory in scanHistories:
            if scanHistory.purchased is False:
                money[scanHistory.scanned_at.month-1] += scanHistory.price
                kcal[scanHistory.scanned_at.month-1] += ProductService.get_by_id(scanHistory.product_id).kcal
        return money, kcal