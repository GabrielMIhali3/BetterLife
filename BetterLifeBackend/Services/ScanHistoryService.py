from Repositories.ProductRepository import ProductRepository
from Repositories.UserRepository import UserRepository
from domain.ScanHistory import ScanHistory
from DTO.ScanHistoryDTO import ScanHistoryDTO
from Mapper.ScanHistoryMapper import ScanHistoryMapper
from Validation.ScanHistoryValidation import ScanHistoryValidation
from Repositories.ScanHistoryRepository import ScanHistoryRepository

class ScanHistoryService:
    @staticmethod
    def add_scanHistory(scanHistoryDTO: ScanHistoryDTO) -> ScanHistoryDTO:
        """Adds a new scan history after validation"""
        if UserRepository.get_by_id(scanHistoryDTO.user_id) is None:
            raise ValueError("User not found")
        if ProductRepository.get_by_id(scanHistoryDTO.product_id) is None:
            raise ValueError("Product not found")
        try:
            scanHistory = ScanHistoryMapper.mapToScanHistory(scanHistoryDTO)
            ScanHistoryValidation.validate_ScanHistory(scanHistory)
            return ScanHistoryMapper.mapToScanHistoryDTO(ScanHistoryRepository.add_scanHistory(scanHistory))
        except Exception as e:
            raise RuntimeError(e)

    @staticmethod
    def get_all_by_user_id(user_id: int) -> list[ScanHistoryDTO]:
        """Gets all scan history by user id"""
        scan_histories = ScanHistoryRepository.get_all_by_user_id(user_id)
        return [ScanHistoryMapper.mapToScanHistoryDTO(s) for s in scan_histories]

    @staticmethod
    def get_by_id(scanHistory_id: int) -> ScanHistoryDTO | None:
        """Gets a scan history by id"""
        scan_history = ScanHistoryRepository.get_by_id(scanHistory_id)
        if scan_history is None:
            return None
        return ScanHistoryMapper.mapToScanHistoryDTO(scan_history)